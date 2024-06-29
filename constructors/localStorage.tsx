import * as SQLite from 'expo-sqlite';
import {string} from "prop-types";

class localDatabase{
    private dbName: string;
    private db: SQLite.SQLiteDatabase;

    constructor(dbName){
        this.dbName = dbName;
        this.db = SQLite.openDatabaseAsync(dbName); // Open SQLite database using dbName
        this.initDatabase(); // Initialize the database schema
    }

    // private initDatabase(){
    //
    // }

}