
/*Return all the elements of firstArray that aren't  in secondArray*/


module.exports = {

    arrayDifferences: ( firstArray, secondArray) => {
        let newArrayDifferences = []
        for(controllNumber1=0;controllNumber1<=firstArray.length;controllNumber1++){
            for(controllNumber2=0;controllNumber2<=secondArray.length;controllNumber2++){
                if(JSON.stringify(secondArray[controllNumber2])===JSON.stringify(firstArray[controllNumber1])){
                    break
                }
                if(secondArray.length === controllNumber2){
                    newArrayDifferences.push(JSON.stringify(firstArray[controllNumber1]))
                }
            }
        } return newArrayDifferences
    }

}

