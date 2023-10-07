// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
import {Collection, MongoClient} from "mongodb";
import {env} from "$lib/variables";
import type {User} from "@auth/core/types";

export type Transaction = {
  id: string;
  date: string;
  email: string;
  subject: string;
  processed: boolean;
  rawData: string;
}

export type DBUser = User & { password: string }

class DB {
  private readonly clientPromise: Promise<MongoClient>;

  constructor() {
    this.clientPromise = new MongoClient(env.mongoUrl, {}).connect()
  }

  public getClient(): Promise<MongoClient> {
    return this.clientPromise;
  }

  public getDatabaseName(): string {
    return "transactions";
  }

  public async getAllTransactions(): Promise<Transaction[]> {
    const collection = await this.dbCollection("email-transactions");
    const data = await collection.find().toArray();
    return data.map(document => ({
      id: document._id.toString(),
      date: document['mailDate'],
      email: document['mailFrom'],
      subject: document['mailSubject'],
      processed: document['processed'],
      rawData: document['mailRawData']
    }));
  }

  public async findUserByEmail(email: string): Promise<DBUser | null> {
    const collection = await this.dbCollection("users");
    const document = await collection.findOne({email});
    if (!document) {
      return null;
    }
    return {
      id: document['id'],
      name: document['name'],
      email: document['email'],
      image: document['image'],
      password: document['password']
    };
  }

  private async dbCollection(collection: string): Promise<Collection> {
    const client = await this.clientPromise;
    return client.db(this.getDatabaseName()).collection(collection);
  }
}


export default new DB()