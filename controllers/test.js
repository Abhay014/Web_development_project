const express = require("express");
const app = express();
app.listen(8000)

const api = {
    "res":"Hello World"
}

// pairs of elements in an array whose sum = 8
const arr = [1, 2, 4, 3, 4];
for (var i = 0; i < arr.length; i++){
    for (var j = 1; j < arr.length; j++){
        if (arr[i] + arr[j] == 8) {
            console.log(arr[i] + ' ' + arr[j]);
        }
    }
}
