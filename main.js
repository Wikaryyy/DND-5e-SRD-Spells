
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

var searchRequest;

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
    var searchArea = document.getElementById("searchArea").value;
    searchRequest = "spells/"+searchArea;
    fetch('https://www.dnd5eapi.co/api/'+searchRequest)
        .then((resp) => resp.json())
        .then((json) => {
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
            console.log(components.innerHTML);
            for(component = 0; component < 3; component++){
                let componentArrayShort = ['V','S','M'];
                let componentArrayFull = ['Verbal','Somatic','Material']
                
                if(components.innerHTML.includes(componentArrayShort[component])){
                    components.title += componentArrayFull[component]+",";
                    
                }
                else{

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
    })
}


