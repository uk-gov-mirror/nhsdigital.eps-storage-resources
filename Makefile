SHELL=/bin/bash -euo pipefail

guard-%:
	@ if [ "${${*}}" = "" ]; then \
		echo "Environment variable $* not set"; \
		exit 1; \
	fi

.PHONY: install install-node build test publish release clean lint compile cdk-synth

install: install-node install-python install-hooks

install-python:
	poetry install

install-node:
	npm ci

install-hooks: install-python
	poetry run pre-commit install --install-hooks --overwrite

compile-node:
	npx tsc --build tsconfig.build.json

compile: compile-node

lint-node: compile-node
	npm run lint --workspace packages/cdk

lint-githubactions:
	actionlint

lint-githubaction-scripts:
	shellcheck .github/scripts/*.sh

lint: lint-node lint-githubactions lint-githubaction-scripts

test: compile
	npm run test --workspace packages/cdk

clean:
	rm -rf packages/cdk/coverage
	rm -rf packages/cdk/lib
	rm -rf cdk.out

deep-clean: clean
	rm -rf .venv
	find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +
	poetry env remove --all

check-licenses: check-licenses-node check-licenses-python

check-licenses-node:
	npm run check-licenses
	npm run check-licenses --workspace packages/cdk

check-licenses-python:
	scripts/check_python_licenses.sh

aws-configure:
	aws configure sso --region eu-west-2

aws-login:
	aws sso login --sso-session sso-session

cfn-guard:
	./scripts/run_cfn_guard.sh

cdk-synth: cdk-synth-pr cdk-synth-non-pr

cdk-synth-pr:
	CDK_CONFIG_versionNumber=undefined \
	CDK_CONFIG_commitId=undefined \
	CDK_CONFIG_isPullRequest=true \
	CDK_CONFIG_environment=dev-pr \
	CDK_CONFIG_stackName=storage-resources-pr-123 \
	npx cdk synth --quiet --app "tsx -- packages/cdk/bin/StorageResourcesApp.ts"

cdk-synth-non-pr:
	CDK_CONFIG_versionNumber=undefined \
	CDK_CONFIG_commitId=undefined \
	CDK_CONFIG_isPullRequest=false \
	CDK_CONFIG_environment=dev \
	CDK_CONFIG_stackName=storage-resources \
	npx cdk synth --quiet --app "tsx -- packages/cdk/bin/StorageResourcesApp.ts"

cdk-diff: guard-service_name
	npx cdk diff \
		--app "npx ts-node --prefer-ts-exts packages/cdk/bin/StorageResourcesApp.ts" \
		--context serviceName=$$service_name \
		--context VERSION_NUMBER=$$VERSION_NUMBER \
		--context COMMIT_ID=$$COMMIT_ID 

cdk-watch: guard-service_name
	REQUIRE_APPROVAL="$${REQUIRE_APPROVAL:-any-change}" && \
	VERSION_NUMBER="$${VERSION_NUMBER:-undefined}" && \
	COMMIT_ID="$${COMMIT_ID:-undefined}" && \
		npx cdk deploy \
		--app "npx ts-node --prefer-ts-exts packages/cdk/bin/StorageResourcesApp.ts" \
		--watch \
		--all \
		--ci true \
		--require-approval $${REQUIRE_APPROVAL} \
		--context serviceName=$$service_name \
		--context VERSION_NUMBER=$$VERSION_NUMBER \
		--context COMMIT_ID=$$COMMIT_ID

%:
	@$(MAKE) -f /usr/local/share/eps/Mk/common.mk $@
