const url = `https://free.currencyconverterapi.com/api/v5/countries `;
let app={
    cF:document.querySelector('#convertFrom'),
    aF:document.querySelector('#amountFrom'),
    cTo:document.querySelector('#convertTo'),
    result : document.querySelector('#result')
};

//Get the countries
fetch(url).then((response)=>{
    return response.json()
}).then((myJson)=>{
    myJson=myJson['results'];
    for (const tx in myJson) {
        let option = document.createElement("option");
        option.text = myJson[tx]['currencyName'];
        option.value = myJson[tx]['currencyId'];
        app.cF.add(option);
        let option1 = document.createElement("option");
        option1.text = myJson[tx]['currencyName'];
        option1.value = option.value = myJson[tx]['currencyId'];
        app.cTo.add(option1);
    }
}).catch((e)=>{
    console.log(e);
});

//This function is called when the user clicks the submit button to convert the currency
changeHandler = () => {
    let cF = encodeURIComponent(app.cF.value);
    let aF = encodeURIComponent(app.aF.value);
    let cTo = encodeURIComponent(app.cTo.value);
    const query = `${cF}_${cTo}`;
    const url1 = `https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=y`
    fetch(url1).then((response)=>{
        return response.json()
    }).then((myJson)=>{
        ans = myJson[query]['val'] * aF;
        result.innerHTML = ans;
    }).catch((e)=>{
        console.log(e);
    })
}