import {createApp, getConfigFromEnvVar} from "@nhsdigital/eps-cdk-constructs"
import {StorageResourcesStack} from "../stacks/StorageResourcesStack"

async function main() {
  const {app, props} = createApp({
    productName: "Storage Resources",
    appName: "StorageResourcesApp",
    repoName: "eps-storage-resources",
    driftDetectionGroup: "storage-resources"
  })

  const stackName = getConfigFromEnvVar("stackName")

  new StorageResourcesStack(app, "StorageResourcesStack", {
    ...props,
    stackName: stackName
  })
}

main()
