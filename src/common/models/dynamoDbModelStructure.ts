import { ACTION_API_TYPES, ACTION_CATEGORIES } from "../constants/db-action-types.enum";
import AWS from "aws-sdk";
import { DynamoDbOptions } from "../types/dynamoDb-options";

export const docClient = new AWS.DynamoDB.DocumentClient();

export class DynamoDbSchema {
    identifierName: string;
    tableVariables: Object;

    constructor(options: DynamoDbOptions) {
        this.tableVariables = options.tableVariables
        this.identifierName = options.identifierName
    }
}

export class DynamoDbModel {
    dbName: string;
    #identifierName: string;

    constructor(dbName: string, identifierName: string ) {
        this.#identifierName = identifierName
        this.dbName = dbName
    }

    declareParams(actionType: ACTION_API_TYPES, actionCategory: ACTION_CATEGORIES, target?: any, additionalQuery?: Object | null) {
        const params: any = {
            TableName: this.dbName,
        }
        switch (actionType) {
            case ACTION_API_TYPES.READ:
                if (actionCategory === ACTION_CATEGORIES.SINGLE) {
                    params.Key = { 
                        [`${this.#identifierName}`]: target[`${this.#identifierName}`] 
                    };

                    return params;
                } else if (actionCategory === ACTION_CATEGORIES.MULTIPLE) {
                    if (additionalQuery) {
                        return {
                            ...params,
                            ...additionalQuery
                        }
                    }
                    return params;
                }
                break;
            case ACTION_API_TYPES.CREATE:

                params.Item = {
                    ...additionalQuery
                } 

                return params;
            case ACTION_API_TYPES.UPDATE:
                params.Key = { 
                    [`${this.#identifierName}`]: target[`${this.#identifierName}`] 
                };
                if (additionalQuery) {
                    return {
                        ...params,
                        ...additionalQuery
                    }
                }
                return params;
            default: 
                break;
        }
    }

    async getOne(identifierId: number): Promise<any> {
        const params = this.declareParams(ACTION_API_TYPES.READ, ACTION_CATEGORIES.SINGLE, {[`${this.#identifierName}`]: identifierId});

        return new Promise((res, rej) => {
            docClient.get(params, (err, data) => {
                if (err) {
                    rej(`Error retrieving data: ${err?.message}`);
                } else {
                    if (!Object.keys(data).length) {
                        res(null)
                    }
                    res(data.Item);
                }
            })
        });
    }

    async getAll(): Promise<any> {
        const params = this.declareParams(ACTION_API_TYPES.READ, ACTION_CATEGORIES.MULTIPLE);

        return docClient.scan(params).promise();
    }

    async updateOne(identifierId: number, additionalQuery: Object): Promise<any> {
        const params = this.declareParams(ACTION_API_TYPES.UPDATE, ACTION_CATEGORIES.SINGLE, {[`${this.#identifierName}`]: identifierId}, additionalQuery);

        return new Promise((res, rej) => {
            docClient.update(params, (err, data) => {
                if (err) {
                    console.log(`Error during update, data id: - ${identifierId}, tableName: - ${this.dbName}`)
                    rej({ success: false, [`${this.#identifierName}`]: identifierId });
                } else {
                    console.log(`Data successfully updated, data id: - ${identifierId}, tableName: - ${this.dbName}`)
                    res({ success: true, [`${this.#identifierName}`]: identifierId })
                }
              });
        })
    }

    
    async save(options: any): Promise<any> {
        const params = this.declareParams(ACTION_API_TYPES.CREATE, ACTION_CATEGORIES.SINGLE, null, options)
        return new Promise((res, rej) => {
            docClient.put(params, (err) => {
                console.log(params, );
                if (err) {
                    console.log(`Error during insertion: data: - `, this, err);
                    res({success: false, [`${this.#identifierName}`]: params.Item[`${this.#identifierName}` as keyof typeof this]})
                } else {
                    console.log(`Data set successfully: data: - `, this);
                    res({success: true, [`${this.#identifierName}`]: params.Item[`${this.#identifierName}` as keyof typeof this], data: params.Item})
                }
            })
        })
    }
}


export const modelCreation = (dbName: string, tableSchema: DynamoDbOptions) => {
    const TableModel = new DynamoDbModel(dbName, tableSchema.identifierName);

    return TableModel;
}

