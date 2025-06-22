import { MongoClient } from 'mongodb';

const uri = process.env.STRING_CONEXAO;

if (!uri) {
    throw new Error('A variável de ambiente não foi definida.');
};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri);
        global._mongoClientPromise = client.connect();
    };
    clientPromise = global._mongoClientPromise;
} else {
    client = new MongoClient(uri);
    clientPromise = client.connect();
};

export default clientPromise;