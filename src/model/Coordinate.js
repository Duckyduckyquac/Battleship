class Coordinate{
    static columnMapping = {
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
    }
    constructor(row, column){
        this.row = row;
        this.column = column;
    }
    getColumnLetter(){
        return Coordinate.columnMapping[this.column];
    }
}
module.exports = {Coordinate};