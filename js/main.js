(function(){

    let yOffset = 0; // 현재 스크롤 된 값
    let prevScrollHeight = 0; // 이전 section들의 height의 합
    let currentScene = 0; // 현재 활성화 된 section
    let enterNewScene = false;

    const sceneInfo = [
        {
            // 0
            type : 'sticky', // 타입에 따라 section의 height값을 설정
            heightNum : 5, // 윈도우사이즈 5배
            scrollHeight : 0,
            objs : {
                sectionContainer : document.querySelector('#scroll-section-0'),
                section_0_messageA : document.querySelector('#scroll-section-0 .main-message.a'),
                section_0_messageB : document.querySelector('#scroll-section-0 .main-message.b'),
                section_0_messageC : document.querySelector('#scroll-section-0 .main-message.c'),
                section_0_messageD : document.querySelector('#scroll-section-0 .main-message.d')
            },
            values:{
                messageA_opacity_in : [0,1,{start:0.1,end:0.2}],
                messageA_opacity_out : [1,0,{start:0.25,end:0.3}],
                messageA_translateY_in : [20, 0, {start:0.1, end:0.2}],
                messageA_translateY_out : [0, -20, {start:0.25,end:0.3}],

                messageB_opacity_in : [0,1,{start:0.3,end:0.4}],
                messageB_opacity_out : [1,0,{start:0.45,end:0.5}],
                messageB_translateY_in : [20, 0, {start:0.3, end:0.4}],
                messageB_translateY_out : [0, -20, {start:0.45,end:0.5}],

                messageC_opacity_in : [0,1,{start:0.5,end:0.6}],
                messageC_opacity_out : [1,0,{start:0.65,end:0.7}],
                messageC_translateY_in : [20, 0, {start:0.5, end:0.6}],
                messageC_translateY_out : [0, -20, {start:0.65,end:0.7}],

                messageD_opacity_in : [0,1,{start:0.7,end:0.8}],
                messageD_opacity_out : [1,0,{start:0.85,end:0.9}],
                messageD_translateY_in : [20, 0, {start:0.7, end:0.8}],
                messageD_translateY_out : [0, -20, {start:0.85,end:0.9}]
            }
        },
        {
            // 1
            type : 'normal',
            heightNum : 5,
            scrollHeight : 0,
            objs : {
                sectionContainer : document.querySelector('#scroll-section-1')
                
            }
        },
        {
            // 2
            type : 'sticky',
            heightNum : 5,
            scrollHeight : 0,
            objs : {
                sectionContainer : document.querySelector('#scroll-section-2'),
                section_2_messageA: document.querySelector('#scroll-section-2 .main-message.a'),
                section_2_messageB: document.querySelector('#scroll-section-2 .desc-message.b'),
                section_2_messageC: document.querySelector('#scroll-section-2 .desc-message.c'),
                pinB: document.querySelector('#scroll-section-2 .desc-message.b .pin'),
                pinC: document.querySelector('#scroll-section-2 .desc-message.c .pin'),
            },
            values: {
                messageA_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
                messageB_translateY_in: [30, 0, { start: 0.6, end: 0.65 }],
                messageC_translateY_in: [30, 0, { start: 0.87, end: 0.92 }],
                messageA_opacity_in: [0, 1, { start: 0.25, end: 0.3 }],
                messageB_opacity_in: [0, 1, { start: 0.6, end: 0.65 }],
                messageC_opacity_in: [0, 1, { start: 0.87, end: 0.92 }],
                messageA_translateY_out: [0, -20, { start: 0.4, end: 0.45 }],
                messageB_translateY_out: [0, -20, { start: 0.68, end: 0.73 }],
                messageC_translateY_out: [0, -20, { start: 0.95, end: 1 }],
                messageA_opacity_out: [1, 0, { start: 0.4, end: 0.45 }],
                messageB_opacity_out: [1, 0, { start: 0.68, end: 0.73 }],
                messageC_opacity_out: [1, 0, { start: 0.95, end: 1 }],
                pinB_scaleY: [0.5, 1, { start: 0.6, end: 0.65 }],
                pinC_scaleY: [0.5, 1, { start: 0.87, end: 0.92 }]
            }
        },
        {
            // 3
            type : 'sticky',
            heightNum : 5,
            scrollHeight : 0,
            objs : {
                sectionContainer : document.querySelector('#scroll-section-3')
            },
            
        }
    ];

    function setLayout() {
        let totalScrollHeight = 0;
        yOffset = window.pageYOffset; // 새로고침됐을때 yOffset 변수가 뭔지 모르기 때문에 정의 해줘야 한다.

        for(let i=0; i<sceneInfo.length; i++){
            if(sceneInfo[i].type === 'sticky'){ // sticky 요소가 있는 section에서는 브라우저 높이 x 설정값(5) 만큼 height를 설정
                sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            } else if(sceneInfo[i].type === 'normal') {
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.sectionContainer.offsetHeight;
            }
            sceneInfo[i].objs.sectionContainer.style.height = `${sceneInfo[i].scrollHeight}px`;
        }
        // 현재 scene 셋팅하기
        for(let i=0; i<sceneInfo.length; i++){
            totalScrollHeight += sceneInfo[i].scrollHeight;
            if(totalScrollHeight >= yOffset){
                currentScene = i;
                break;
            }
        }
        document.body.setAttribute('id', `show-scene-${currentScene}`);
    }

    function scrollLoop(){
        enterNewScene = false;
        prevScrollHeight = 0;

        // 현재 활성화된 scene 몇번째인지 알아보자
        for(let i=0; i<currentScene; i++){
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }

        if(yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight){
            enterNewScene = true;
            currentScene ++;
            document.body.setAttribute('id',`show-scene-${currentScene}`);
        }
        if(yOffset < prevScrollHeight){
            enterNewScene = true;
            if(currentScene === 0) return;
            currentScene --;
            document.body.setAttribute('id',`show-scene-${currentScene}`);
        }
        // document.body.setAttribute('id',`show-scene-${currentScene}`);

        if(enterNewScene){return;}

        playAnimation();
    }

    function calcValues(values, currentYOffset){
        let rv = 0;
        const scrollHeight = sceneInfo[currentScene].scrollHeight; // 현재 scene의 height값
        const scrollRatio = currentYOffset / scrollHeight; //현재 scene에서의 스크롤 값 비율

        

        
        // console.log(partScrollRatio);

        if(values.length === 3){ //부분 애니 재생이 있을경우

            const partScrollStart = values[2].start * scrollHeight;
            const partScrollEnd = values[2].end * scrollHeight;
            const partScrollHeight = partScrollEnd - partScrollStart;
            const partScrollRatio = (currentYOffset - partScrollStart) / partScrollHeight;

            if(currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd){
                rv = partScrollRatio * (values[1]-values[0]) + values[0];
            } else if(currentYOffset < partScrollStart){
                rv = values[0];
            } else if(currentYOffset > partScrollEnd){
                rv = values[1];
            }
        } else {
            rv = scrollRatio * (values[1]-values[0]) + values[0];
        }
        
        return rv;
    }

    function playAnimation(){
        const values = sceneInfo[currentScene].values;
        const objs = sceneInfo[currentScene].objs;
        const currentYOffset = yOffset - prevScrollHeight;  //현재 scene에서의 pageYOffset값 (currentYOffset)
        const scrollRatio = currentYOffset / sceneInfo[currentScene].scrollHeight; // 현재 scene에서의 스크롤 비율

        switch(currentScene){

            case 0:
            // console.log("0play");
                // 아래와 같이 분기를 하는 이유는 in과 out의 범위가 겹치기 때문에 나누어 줘야함
                if(scrollRatio < 0.22){
                    objs.section_0_messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.section_0_messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_in, currentYOffset)}%)`;
                } else if(scrollRatio > 0.22){
                    objs.section_0_messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.section_0_messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_out, currentYOffset)}%)`;
                }
                
                if(scrollRatio < 0.42){
                    objs.section_0_messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                    objs.section_0_messageB.style.transform = `translateY(${calcValues(values.messageB_translateY_in,currentYOffset)}%)`;
                } else if(scrollRatio > 0.42){
                    objs.section_0_messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                    objs.section_0_messageB.style.transform = `translateY(${calcValues(values.messageB_translateY_out,currentYOffset)}%)`;
                }

                if(scrollRatio < 0.62){
                    objs.section_0_messageC.style.opacity = calcValues(values.messageC_opacity_in,currentYOffset);
                    objs.section_0_messageC.style.transform = `translateY(${calcValues(values.messageC_translateY_in,currentYOffset)}%)`;
                } else if(scrollRatio > 0.62){
                    objs.section_0_messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                    objs.section_0_messageC.style.transform = `translateY(${calcValues(values.messageC_translateY_out,currentYOffset)}%)`;
                }

                if(scrollRatio < 0.82){
                    objs.section_0_messageD.style.opacity = calcValues(values.messageD_opacity_in,currentYOffset);
                    objs.section_0_messageD.style.transform = `translateY(${calcValues(values.messageD_translateY_in,currentYOffset)}%)`;
                } else if(scrollRatio > 0.82){
                    objs.section_0_messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
                    objs.section_0_messageD.style.transform = `translateY(${calcValues(values.messageD_translateY_out,currentYOffset)}%)`;
                }
            break;

            case 1:
            // console.log("1play");
            break;

            case 2:
            // console.log("2play");
            if (scrollRatio <= 0.32) {
                // in
                objs.section_2_messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                objs.section_2_messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
            } else {
                // out
                objs.section_2_messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                objs.section_2_messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
            }

            if (scrollRatio <= 0.67) {
                // in
                objs.section_2_messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
                objs.section_2_messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
            } else {
                // out
                objs.section_2_messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
                objs.section_2_messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
            }

            if (scrollRatio <= 0.93) {
                // in
                objs.section_2_messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
                objs.section_2_messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
            } else {
                // out
                objs.section_2_messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
                objs.section_2_messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
            }
            break;

            case 3:
            // console.log("3play");
            break;
        }
    }   
    

    
    window.addEventListener('scroll', () => {
        yOffset = window.pageYOffset;
        scrollLoop();
    });

    window.addEventListener('resize',setLayout);
    window.addEventListener('load',setLayout);
    // window.addEventListener('DOMContentLoaded',() =>{}); Html 구성만 로드가 완료되면 실행하는 이벤트 (이미지 로드x)
    
})();