const EMPTYRES = "_ _";
const DECIMAL_PLACE = 0;

function onCalc(){
    let age = document.getElementById("inputAge").value;
	let sex = document.getElementById("inputSex").value;
	let hr = document.getElementById("inputHr").value;
    let qt = document.getElementById("inputQt").value;
	let qtBBB = document.getElementById("inputQtBbb").value;
    let qtVp = document.getElementById("inputQtVp").value;
    let qtWpw = document.getElementById("inputQtWpw").value;
	let qrs = document.getElementById("inputQrs").value;  

    if (hr > 155 || hr < 35) {
        document.getElementById("errMsg").innerHTML = !hr? 'Please input heart rate' : 'Outside 35-155bpm range';
        // reset all output
        document.getElementById("outQt").innerHTML = EMPTYRES;
        document.getElementById("outQtLBBB").innerHTML = EMPTYRES;
        document.getElementById("outQtPR").innerHTML = EMPTYRES;
        document.getElementById("outQtWPW").innerHTML = EMPTYRES;
    } else {
        // Calculate qtcRbk using different QT value
        let qtcrbk = caclulation(age, sex, hr, qt);
        let qtcrbkBBB = caclulation(age, sex, hr, qtBBB); 
        let qtcrbkPR= caclulation(age, sex, hr, qtVp);
        let qtcrbkWPW = caclulation(age, sex, hr, qtWpw);
        
        // setting HTML elements
        document.getElementById("outQt").innerHTML = qtcrbk? qtcrbk.toFixed(DECIMAL_PLACE) : 'Please input QT';;
        document.getElementById("outQtLBBB").innerHTML = qtcrbkBBB? (0.945*qtcrbkBBB - 26).toFixed(DECIMAL_PLACE) : 'Please input QT for BBB';
        document.getElementById("outQtPR").innerHTML = qtcrbkPR? (qrs? (qtcrbkPR - qrs*0.5).toFixed(DECIMAL_PLACE): 'Please input QRS'): 'Please input QT for VP';
        document.getElementById("outQtWPW").innerHTML = qtcrbkWPW? (qrs? (qtcrbkWPW - 0.462*qrs + 18.26).toFixed(DECIMAL_PLACE): 'Please input QRS'): 'Please input QT for WPW';
        document.getElementById("errMsg").innerHTML = '';
    }
}

// get QtcRbk based on different kind of QT input
function caclulation(age, sex, hr, qt) {
    let result = "";

    // use HR to calculate a bunch of vars, V-> AG
    let V =(hr-35)/(61-35);
    let W =(hr-35)/(67-35);
    let X =(hr-61)/(67-61);
    let Y =(hr-35)/(73-35);
    let Z =(hr-61)/(73-61);
    let AA =(hr-67)/(73-67);
    let AB =(hr-61)/(81-61);
    let AC =(hr-67)/(81-67);
    let AD =(hr-73)/(81-73);
    let AE =(hr-67)/(156-67);
    let AF =(hr-73)/(156-73);
    let AG =(hr-81)/(156-81);
    // if hr is within some range get B1, B2, B3, B4, B5, B6, B7
    let B1_1 = (hr>=35 && hr<61)? V*(Math.pow((1-V),2)+(1-V)*(1-W)+Math.pow((1-W),2)) : 0;
    let B1 = (hr>=61 && hr<67)? B1_1+Math.pow((1-W),2)*(1-X) : B1_1;
    let B2_1 = (hr>=35 && hr<61)? V*W*((1-V)+(1-W)+(1-Y)) : 0;
    let B2_2 = (hr>=61 && hr<67)? B2_1+W*(1-X)*((1-W)+(1-Y))+X*(1-Y)*(1-Z) : B2_1;
    let B2 = (hr>=67 && hr<73)? B2_2+(1-Y)*(1-Z)*(1-AA) : B2_2;
    let B3_1 = (hr>=35 && hr<61)? V*W*Y : 0;
    let B3_2 = (hr>=61 && hr<67)? B3_1+(Y*(W*(1-X)+X*(1-Z)))+X*Z*(1-AB) : B3_1;
    let B3_3 = (hr>=67 && hr<73)? B3_2+((1-AA)*(Y*(1-Z)+Z*(1-AB)))+AA*(1-AB)*(1-AC) : B3_2;
    let B3 = (hr>=73 && hr<81)? B3_3+(1-AB)*(1-AC)*(1-AD) : B3_3;
    let B4_1 = (hr>=61 && hr<67)? X*Z*AB : 0;
    let B4_2 = (hr>=67 && hr<73)? B4_1+AB*(Z*(1-AA)+AA*(1-AC))+AA*AC*(1-AE) : B4_1;
    let B4_3 = (hr>=73 && hr<81)? B4_2+(1-AD)*(AB*(1-AC)+AC*(1-AE))+AD*(1-AE)*(1-AF) : B4_2;
    let B4 = (hr>=81 && hr<156)? B4_3+(1-AE)*(1-AF)*(1-AG) : B4_3;
    let B5_1 = (hr>=67 && hr<73)? AA*AC*AE : 0;
    let B5_2 = (hr>=73 && hr<81)? B5_1+AE*(AC*(1-AD)+AD*(1-AF))+AD*AF*(1-AF) : B5_1;
    let B5 = (hr>=81 && hr<156)? B5_2+(1-AF)*(1-AG)*(AE+AF+AG) : B5_2;
    let B6_1 = (hr>=73 && hr<81)? AD*Math.pow((AF),2) : 0;
    let B6 = (hr>=81 && hr<156)? B6_1+(1-AG)*(Math.pow((AF),2)+AF*AG+Math.pow((AG),2)) : B6_1;
    let B7 = (hr>=81 && hr<156)? Math.pow((AG),3) : 0;

    // use B1-B7 to calcualte QT
    let QT_calc = 0; 
    if (sex === "Female") {
        QT_calc = 523.29-(76.94*B1)-(101.59*B2)-(130.81*B3)-(144.79*B4)-(196.76*B5)-(231.01*B6)-(247.84*B7)+9.35+0.18*age ;
    } else if (sex === "Male") {
        QT_calc = 523.29-(76.94*B1)-(101.59*B2)-(130.81*B3)-(144.79*B4)-(196.76*B5)-(231.01*B6)-(247.84*B7)+0.18*age;
    }

    // set qtcspl
    if (qt && age && hr) {
        result = 417.7246+(qt - QT_calc)
    } else {
        return result
    }
    // set qtcspl-qrs
    // if (qrs === "") {
    //     result.splqrs = EMPTYRES;
    // } else if (hr > 155 || hr < 35) {
    //     result.splqrs = "Outside 35-155bpm range";
    // } else {
    //     result.splqrs = (result.spl - qrs).toFixed(3);
    // }        
    return result;
}
