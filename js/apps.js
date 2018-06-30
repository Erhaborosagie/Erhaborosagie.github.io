let app={
    cF:document.querySelector('#convertFrom'),
    aF:document.querySelector('#amountFrom'),
    cTo:document.querySelector('#convertTo'),
    converted : document.querySelector('#converted'),
    countries:['a']
};
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js')
    });
}
//Get the countries
const url = `https://free.currencyconverterapi.com/api/v5/countries `;
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
    const query2 = `${cTo}_${cF}`;
    // call fetch so as to get latest conversion rate
    const url1 = `https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=y`;
    fetch(url1).then((response)=>{

        return response.json()

    }).then((myJson)=>{  

        ans = myJson[query]['val'] * aF;
        converted.innerHTML = ans;

        getRate(myJson, 'putData', query, query2, aF) 
        
    }).catch((e)=>{

        getRate(' No internet', 'getData', query, query2, aF) 

    })
}


function getRate(myJson, mode, query, query2, aF) {
    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    if (!window.indexedDB) {
        ans = myJson[query]['val'] * aF;
        converted.innerHTML = ans;
        return;
    }
    let request = window.indexedDB.open("currencyConverter", 1);

    request.onupgradeneeded=(e)=>{
        let db = request.result;
        store = db.createObjectStore("country", { keyPath: "countryId" });
        let Index = store.createIndex("currencyId", "currencyId", {unique: true});
    };

    request.onsuccess=(e)=>{
        db = request.result;
        let tx = db.transaction("country", "readwrite");
        let store =tx.objectStore("country");

        if (mode==='putData') {
            let message = myJson[query]['val'];
            let message2 = 1/message
            store.put({countryId:query,rate:message});
            store.put({countryId:query2,rate:message2});
        } else {
            req =store.get(query)
            req.onsuccess=(e) =>{
                let matching = req.result;
                if (matching !== undefined) {
                    converted.innerHTML =matching['rate'] * aF;
                } else {
                    // No match was found.
                    ans = 'Internet connection needed';
                    converted.innerHTML = ans;
                }
            }
        }
        tx.oncomplete = () => {
            db.close();
        }
    }

    request.onerror=(e) => {
        ans = 'Please try again later';
        converted.innerHTML = ans;
    }
}