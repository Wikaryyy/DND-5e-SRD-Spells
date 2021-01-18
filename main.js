

var spellName = document.getElementById("spellName");
var level = document.getElementById("level");
var castingTime = document.getElementById("castingTime");
var range = document.getElementById("range");
var components = document.getElementById("components");
var duration = document.getElementById("duration");
var school = document.getElementById("school");
var attackSave = document.getElementById("attackSave");
var dmgEffect = document.getElementById("dmgEffect");
var description = document.getElementById("description"); 
var errorInfo = document.getElementById("errorInfo");
var classes = document.getElementById("classes");
var controller = new AbortController();

var searchRequest;

//autoComplete.js Library 
const autoComplete = new autoComplete({
    name:"dnd spells",
    data: {                              // Data src [Array, Function, Async] | (REQUIRED)
      src: async () => {
        // API key token
        const token = "this_is_the_API_token_number";
        // User search query
        const query = document.querySelector("#autoComplete").value;
        // Fetch External Data Source
        const source = await fetch(`https://www.dnd5eapi.co/api/spells/${query}`);
        // Format data into JSON
        const data = await source.json();
        // Return Fetched data
        return data.spells;
      },
      key: ["title"],
      cache: false
    },
    sort: (a, b) => {                    // Sort rendered results ascendingly | (Optional)
        if (a.match < b.match) return -1;
        if (a.match > b.match) return 1;
        return 0;
    },
    placeHolder: "Spell...",     // Place Holder text                 | (Optional)
    selector: "#autoComplete",           // Input field selector              | (Optional)
    observer: true,                      // Input field observer | (Optional)
    threshold: 3,                        // Min. Chars length to start Engine | (Optional)
    debounce: 300,                       // Post duration for engine to start | (Optional)
    searchEngine: "loose",              // Search Engine type/mode           | (Optional)
    resultsList: {                       // Rendered results list object      | (Optional)
        container: source => {
            source.setAttribute("id", "food_list");
        },
        destination: "#autoComplete",
        position: "afterend",
        element: "ul"
    },
    maxResults: 5,                         // Max. number of rendered results | (Optional)
    highlight: true,                       // Highlight matching results      | (Optional)
    resultItem: {                          // Rendered result item            | (Optional)
        content: (data, source) => {
            source.innerHTML = data.match;
        },
        element: "li"
    },
    noResults: (dataFeedback, generateList) => {
        // Generate autoComplete List
        generateList(autoCompleteJS, dataFeedback, dataFeedback.results);
        // No Results List Item
        const result = document.createElement("li");
        result.setAttribute("class", "no_result");
        result.setAttribute("tabindex", "1");
        result.innerHTML = `<span style="display: flex; align-items: center; font-weight: 100; color: rgba(0,0,0,.2);">Found No Results for "${dataFeedback.query}"</span>`;
        document.querySelector(`#${autoCompleteJS.resultsList.idName}`).appendChild(result);
    },
    onSelection: feedback => {             // Action script onSelection event | (Optional)
        console.log(feedback.selection.value.image_url);
    }
});

function clearSpellContainer() {
    spellName.innerHTML = " ";
    level.innerHTML = " ";
    castingTime.innerHTML = " ";
    range.innerHTML = " ";
    components.innerHTML = " ";
    duration.innerHTML = " ";
    school.innerHTML = " ";
    attackSave.innerHTML = " ";
    dmgEffect.innerHTML = " ";
    description.innerHTML = " ";
}

function getSpell(){
    clearSpellContainer()
    var searchArea = document.getElementById("autoComplete").value.toLowerCase().replaceAll(" ","-");
    searchRequest = "spells/"+searchArea;
    fetch('https://www.dnd5eapi.co/api/'+searchRequest)
        .then(function(resp) {
            console.log(resp.status);
            console.log(!resp.ok);
            if(resp.status == 404){
                errorInfo.innerHTML = " ";
                errorInfo.innerHTML = "The spell you are looking for may not be in the SRD or you wrote it wrong ";
                controller.abort();
            }
            if (!resp.ok) {
                
                throw new Error("HTTP status " + resp.status);
            }
            return resp.json();
        })
        .then((json) => {
            errorInfo.innerHTML = " ";
            console.log(json)
            spellName.innerHTML +="<br>"+json.name;
            if(json.level == 0){
                level.innerHTML += "<br> Cantrip";    
            }
            else{
                level.innerHTML += "<br>"+json.level;
            }
            castingTime.innerHTML += "<br>"+json.casting_time;
            range.innerHTML += "<br>"+json.range;
            components.innerHTML += "<br>"+json.components;
            for(component = 0; component < 3; component++){
                let componentArrayShort = ['V','S','M'];
                let componentArrayFull = ['Verbal','Somatic','Material']
                
                if(components.innerHTML.includes(componentArrayShort[component])){
                    components.title += componentArrayFull[component]+",";   
                }
            }
            duration.innerHTML += "<br>"+json.duration;
            school.innerHTML += "<br>"+json.school.name;
            switch(json.attack_type){

            case undefined:
                try{
                    attackSave.innerHTML += "<br>"+json.dc.dc_type.name;
                }
                catch(e){

                        attackSave.innerHTML += "<br>"+"None";
                }
            break;
                
            default:
                attackSave.innerHTML += "<br>"+json.attack_type;
            break;
            }
            
            if(typeof json.damage != "undefined" && typeof json.damage.damage_type != "undefined"){
                dmgEffect.innerHTML += "<br>"+json.damage.damage_type.name;
            }
            else{
                dmgEffect.innerHTML += "<br> Check Description" ; 
            }
            description.innerHTML += "<br>"+json.desc;
            console.log(json.classes.length);
            for(i = 0; i < json.classes.length; i++){
                if(classes.innerHTML == ""){
                    classes.innerHTML +="<br>"+ json.classes[i].name;
                }
                else
                {
                    classes.innerHTML +=", " +json.classes[i].name; 
                }
               
            }
    })
}



