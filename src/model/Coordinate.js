class Coordinate{
    constructor(row, column){
        this.row = row;
        this.column = column;
        this.columnMapping = {
            "1":"A",
            "2":"B",
            "3":"C",
            "4":"D",
            "5":"E",
            "6":"F",
            "7":"G",
            "8":"H",
            "9":"I",
            "10":"J"
        };
    }
}
module.exports = {Coordinate};