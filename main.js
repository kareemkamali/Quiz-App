//Select Element
let countSpan=document.querySelector(".quiz-info .count span");
let bulletsSpan=document.querySelector(".bullets .spans");

let questionArea=document.querySelector(".quiz-area");
let answerArea=document.querySelector(".answers-area");
let bulletsElement=document.querySelector(".bullets");
let submitbutton=document.querySelector(".submit-button");

let results=document.querySelector(".results");

let CountDownSpan=document.querySelector('.countdown');

//set Options

let currentIndex=0;
let correctAnswers=0;

let countDownInterval;


function getQuestions() {
    let myRequest=new XMLHttpRequest();

myRequest.onreadystatechange=function () {
    if(this.readyState=== 4 && this.status ===200) {

        let questionsObject=JSON.parse(this.responseText);
        //variable get the length of json object
        let qCount=questionsObject.length;


        //crates bullets +count question
        createBullets(qCount);
        
        
        // Add Questions Data
        addQuestionData(questionsObject[currentIndex],qCount);
        
        // Start CountDown 
        countDown(10,qCount);
        //click onSubmit

            submitbutton.addEventListener('click',()=>{
                let rightAnswer=questionsObject[currentIndex].right_answer;
              
                 //Increase Index
                currentIndex++;

                //check Answer
            checkAnswer(rightAnswer,qCount);

                //Remove Previous Questions
                questionArea.innerHTML='';
                answerArea.innerHTML='';
                //add The Next Question
                addQuestionData(questionsObject[currentIndex],qCount);

                // handleBullets class
                handleBullets();

                 
        // Start CountDown 
        clearInterval(countDownInterval);
        countDown(10,qCount);

                //show Results
                showResults(qCount);

            })



    }
};

    myRequest.open("GET","html_questions.json",true);
    myRequest.send(); 



}
getQuestions();

function createBullets(num) {
    countSpan.innerHTML=`${num}`;

    //create spans bullets
    for(let i=0;i<num;i++) {
        let bullet=document.createElement('span');
         //add active class to first (check);
    if (i===0){
            bullet.className="on";
        }
        //append bullet to main container
        bulletsSpan.appendChild(bullet);

    }
    
}

function addQuestionData(obj,count) {
if(currentIndex < count) {
//Start Area Title 
// create h2 title
let questionTitle=document.createElement("h2");
//crete textNode
let questionText=document.createTextNode(obj.title);
//append into h2
questionTitle.appendChild(questionText);
//append into area
questionArea.appendChild(questionTitle);
// End Area Title

// Start Answer Area
for(let i=0;i<4;i++) {
    // create main div
    let mainDiv=document.createElement('div');
    //add class to main div
    mainDiv.className='answer';
// add input radio 
let radio=document.createElement('input');
//Add Type+id+name+Data-Atrribute ( to compare with right answer)
radio.type='radio';
radio.name='question';
radio.id=`answer_${i+1}`;
radio.dataset.answer=obj[`answer_${i+1}`]
//Make First Option Select

i===0?radio.checked=true:false


//create label 
let labelAnswer=document.createElement("label");

//add For Attribute
labelAnswer.htmlFor=`answer_${i+1}`;

// Create Labeltext
let labelText=document.createTextNode(obj[`answer_${i+1}`]);
//Append Text to Label
labelAnswer.appendChild(labelText);


//append radio 
mainDiv.appendChild(radio);
answerArea.appendChild(mainDiv);


//append Label to MainDiv
mainDiv.appendChild(labelAnswer);


}


// End Answer Area
    }

}


function checkAnswer(rAnswer,count){
let answers =document.getElementsByName("question");
let theChoosenAnswer;
for (let i=0;i<answers.length;i++) {
    if(answers[i].checked) {
        theChoosenAnswer=answers[i].dataset.answer;

    if(theChoosenAnswer===rAnswer){
        correctAnswers++;
        
    }


    }
}
}


function handleBullets() {
    let bulletsSpans=document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans=Array.from(bulletsSpans);
    arrayOfSpans.forEach((span,index)=>{
        if(currentIndex===index) {
            span.className='on'
        }
    })
}

function showResults(count){
    let theFinalResult;
    if(currentIndex===count) {
        questionArea.remove();
        answerArea.remove();
        bulletsElement.remove();
        submitbutton.remove();



        if(correctAnswers >(count/2) && correctAnswers <count) {

            theFinalResult=`<span class="good">Good</span>, ${correctAnswers} From ${count} Is Good`;
        }else if (correctAnswers===count) {
            theFinalResult=`<span class="perfect">perfect</span>,All Is Correct`;
        }else {

            theFinalResult=`<span class="bad">Sorry</span>,${correctAnswers} From ${count} Is Bad`;
        }

        results.innerHTML=theFinalResult;
        results.style.padding='10px';
        results.style.backgroundColor='white'
        results.style.marginTop='10px'
    }
}

function countDown(duration,count) {
    if(currentIndex <count) {
        let minutes,seconds;

        countDownInterval=setInterval(() => {
            minutes=parseInt(duration/60);
            seconds=parseInt(duration % 60);

            minutes=minutes <10?`0${minutes}`:minutes;
            seconds=seconds <10?`0${seconds}`:seconds;
            
            CountDownSpan.innerHTML=`${minutes}:${seconds}`;

            if (--duration <0) {
                clearInterval(countDownInterval);
                submitbutton.click();
             
            }
        }, 1000);
    }
}