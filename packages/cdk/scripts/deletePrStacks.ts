import {deleteUnusedPrStacks} from "@nhsdigital/eps-cdk-constructs"

deleteUnusedPrStacks(
  "storage-resources"
).catch((error) => {
  console.error(error)
  process.exit(1)
})
