export default  interface  IMySqlResult{
    fieldcount: number;
    affectedRows: number;
    insertId: number;
    ServerStatus: number;
    warningCount: number;
    message: string;
    protocol41: boolean;
    changedRows: number;
}