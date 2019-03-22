const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.ITEMS_DYNAMODB_TABLE;

module.exports.saveItem = item => {
  const params = {
    TableName: TABLE_NAME,
    Item: item
  };

  return dynamo.put(params).promise().then(() => {
    return item.id
  });
}

module.exports.getItem = itemId => {
  const params = {
    Key: {
      id: itemId
    },
    TableName: TABLE_NAME
  };

  return dynamo.get(params).promise().then((result) => {
    return result;
  });
}

module.exports.deleteItem = itemId => {
  const params = {
    Key: {
      id: itemId
    },
    TableName: TABLE_NAME
  };

  return dynamo.delete(params).promise();
}

module.exports.updateItem = (itemId, paramName, paramValue) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id: itemId
    },
    ConditionExpression: 'attribute_exists(id)',
    UpdateExpression: 'set ' + paramName + ' = :v',
    ExpressionAttributeValues: {
      ':v': paramValue
    },
    ReturnValues: 'ALL_NEW'
  };

  return dynamo.update(params).promise().then((response) => {
    return response.Attributes;
  });
}
