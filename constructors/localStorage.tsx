// import * as SQLite from 'expo-sqlite';
// import exp from "node:constants";
//
//
// class localDatabase{
//     private db: SQLite.SQLiteDatabase;
//
//     constructor(){
//
//         this.db = SQLite.openDatabaseAsync("localDB"); // Open SQLite database using dbName
//         this.db.execAsync(
//           `CREATE TABLE IF NOT EXISTS USER (USER_ID CHARACTER(36), USER_EMAIL VARCHAR(60), USER_NAME VARCHAR(25))`
//         );
//     }
//
//     // Function to insert user data
//     public async insertUser(id,name,email){
//         const insertingUser = await this.db.runAsync(
//             'INSERT INTO USER (USER_ID,USER_EMAIL,USER_NAME) VALUES (?,?,?)', [id,email,name]
//         );
//         console.log(insertingUser);
//     }
//
//     // Get everything
//     public async retreiveAll(){
//         const userDetail = await this.db.getFirstAsync(
//             'SELECT * FROM USER'
//         );
//         console.log(userDetail);
//     }
//
//     // Retreive user id
//     public async retreiveID(){
//         const userID = await this.db.getFirstAsync(
//             'SELECT USER_ID FROM USER'
//         );
//         console.log(userID);
//     }
//
//     // Retreive user name
//     public async retreiveName(){
//         const username = await this.db.getFirstAsync(
//             'SELECT USER_NAME FROM USER'
//         );
//         console.log(username);
//     }
//
//     // Retreive user email
//     public async retreiveEmail(){
//         const useremail = await this.db.getFirstAsync(
//             'SELECT USER_EMAIL FROM USER'
//         );
//         console.log(useremail);
//     }
//
//     // Delete all values from table
//     public async deleteUserRow(){
//         const deleteUser = await this.db.runAsync(
//           'DELETE FROM USER'
//         );
//         console.log(deleteUser);
//     }
// }
// export {localDatabase};