import * as mysql2 from 'mysql2';
import app from './app';
import { AppDataSource } from './data-source';



const start = async () => {
    await AppDataSource.initialize()
    console.log('Database connection initialized successfully');
    console.log("Connecting to database:", process.env.MYSQL_DATABASE);
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {console.log(`app start on ${PORT}`)})
}


start();