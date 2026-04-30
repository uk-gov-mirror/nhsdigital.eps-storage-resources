import {
  App,
  CfnOutput,
  Stack,
  StackProps
} from "aws-cdk-lib"

import {nagSuppressions} from "../nagSuppressions"
// import {Dynamodb} from "../resources/Dynamodb"

export interface StorageResourcesStackProps extends StackProps{
  readonly stackName: string
  readonly version: string
  readonly environment: string
}

/**
 * EPS Storage Resources
 */

export class StorageResourcesStack extends Stack {
  public constructor(scope: App, id: string, props: StorageResourcesStackProps){
    super(scope, id, props)

    // Context
    /* context values passed as --context cli arguments are passed as strings so coerce them to expected types*/
    // const allowAutoDeleteObjects: boolean = this.node.tryGetContext("allowAutoDeleteObjects")

    // Imports

    // Resources
    // const dynamodb = new Dynamodb(this, "DynamoDB", {
    //   stackName: props.stackName,
    //   account: this.account,
    //   region: this.region,
    //   allowAutoDeleteObjects: allowAutoDeleteObjects
    // })

    //Outputs

    //Exports
    // new CfnOutput(this, "tableWriteManagedPolicyArn", {
    //   value: dynamodb.tableWriteManagedPolicy.managedPolicyArn,
    //   exportName: `${props.stackName}:tableWriteManagedPolicy:Arn`
    // })
    // new CfnOutput(this, "tableReadManagedPolicyArn", {
    //   value: dynamodb.tableReadManagedPolicy.managedPolicyArn,
    //   exportName: `${props.stackName}:tableReadManagedPolicy:Arn`
    // })
    // new CfnOutput(this, "usePrescriptionsTableKmsKeyPolicyArn", {
    //   value: dynamodb.usePrescriptionsTableKmsKeyPolicy.managedPolicyArn,
    //   exportName: `${props.stackName}:usePrescriptionsTableKmsKeyPolicy:Arn`
    // })
    // new CfnOutput(this, "DatastoreTableArn", {
    //   value: dynamodb.DatastoreTable.tableArn,
    //   exportName: `${props.stackName}:DatastoreTable:Arn`
    // })
    const veit07KeyArn = "arn:aws:kms:eu-west-2:591291862413:key/e227a1b4-7a7f-4836-b753-a901869a271c"
    const kmsKeyArns: Record<string, string> = {
      "dev": veit07KeyArn,
      "dev-pr": veit07KeyArn,
      "qa": veit07KeyArn,
      "int": "arn:aws:kms:eu-west-2:399793560585:key/781854ba-6d44-4765-b680-533eacfd5bf2",
      "ref": "arn:aws:kms:eu-west-2:158471595810:key/c647165e-3b2d-4500-bd2f-340e3b6b4e22",
      "prod": "arn:aws:kms:eu-west-2:434629240718:key/552151fb-5eeb-419e-bb04-9965a0010355"
    }
    new CfnOutput(this, "DatastoreKmsKeyArn", {
      value: kmsKeyArns[props.environment],
      exportName: `${props.stackName}:DatastoreKmsKey:Arn`
    })
    nagSuppressions(this)
  }
}
