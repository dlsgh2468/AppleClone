(function(){

    let yOffset = 0; // 현재 스크롤 된 값
    let prevScrollHeight = 0; // 이전 section들의 height의 합
    let currentScene = 0; // 현재 활성화 된 section
    let enterNewScene = false;
    let delayedYOffset = 0;
    let rafId = false;
    let rafState = false;
    const acc = 0.1;

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
                section_0_messageD : document.querySelector('#scroll-section-0 .main-message.d'),
                canvas : document.querySelector('#video-canvas-0'),
                context : document.querySelector('#video-canvas-0').getContext('2d'),
                videoImages : []
            },
            values:{
                imageCount : 300,
                imageSequence : [0,299],
                canvas_opacity : [1,0,{start:0.9, end: 1}],
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
                canvas : document.querySelector('#video-canvas-1'),
                context : document.querySelector('#video-canvas-1').getContext('2d'),
                videoImages : []
            },
            values: {
                imageCount : 960,
                imageSequence : [0,959],
                canvas_opacity_in : [0,1,{start:0, end: 0.1}],
                canvas_opacity_out : [1,0,{start:0.95, end: 1}],
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
                sectionContainer : document.querySelector('#scroll-section-3'),
                canvasCaption : document.querySelector('#scroll-section-3 .canvas-caption'),
                imagePath : ['./img/blend-image-1.jpg','./img/blend-image-2.jpg'],
                canvas : document.querySelector('.image-blend-canvas'),
                context : document.querySelector('.image-blend-canvas').getContext('2d'),
                blendImage : []
            },
            values : {
                // 얘는 스크롤 비율에 따라 진행을 하긴 하지만 canvas의 크기가 창사이즈가 바뀌면 크기가 바뀌므로 미리 값을 정할수 없다.
                rect1X : [0, 0, {start: 0, end: 0}], // 이전에는 스크롤 비율에 따라 시작값과 끝값을 설정했지만 이 부분은 canvas가 브라우저 맨위에 닿는 시점에 끝나게 하기 위해서 계산을 따로 해서 넣어줘야 한다.
                rect2X : [0, 0, {start: 0, end: 0}],
                blendHeight : [0,0,{start:0,end:0}],
                rectStartY : 0,
                scaleNum : [0,0,{start:0,end:0}],
                canvasCaption_opactiy : [0, 1, {start:0, end:0}],
                canvasCaption_translateY : [20,0, {start:0, end:0}]
            }
            
        }
    ];

    function setCanvasImage(){
        let imgElem;

        for(let i=0; i<sceneInfo[0].values.imageCount; i++){
            imgElem = new Image();
            imgElem.src = `./video/001/IMG_${6726 + i}.JPG`;
            sceneInfo[0].objs.videoImages.push(imgElem);
        }

        for(let i=0; i<sceneInfo[2].values.imageCount; i++){
            imgElem = new Image();
            imgElem.src = `./video/002/IMG_${7027 + i}.JPG`;
            sceneInfo[2].objs.videoImages.push(imgElem);
        }

        let imgElem3;
        for(let i=0; i<sceneInfo[3].objs.imagePath.length; i++){
            imgElem3 = new Image();
            imgElem3.src = sceneInfo[3].objs.imagePath[i];
            sceneInfo[3].objs.blendImage.push(imgElem3);
        }
        
    }

    

    function checkMenu(){ // 메뉴 고정 함수
        if(yOffset > 44){
            document.body.classList.add('local-nav-sticky');
        } else {
            document.body.classList.remove('local-nav-sticky');
        }
    }

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

        const heightRatio = window.innerHeight / sceneInfo[0].objs.canvas.height;
        sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%,-50%,0) scale(${heightRatio})`;
        sceneInfo[2].objs.canvas.style.transform = `translate3d(-50%,-50%,0) scale(${heightRatio})`;

    }

    function scrollLoop(){
        enterNewScene = false;
        prevScrollHeight = 0;

        // 현재 활성화된 scene 몇번째인지 알아보자
        for(let i=0; i<currentScene; i++){
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }

        if(delayedYOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight){
            enterNewScene = true;
            currentScene ++;
            // document.body.setAttribute('id',`show-scene-${currentScene}`);
        }
        if(delayedYOffset < prevScrollHeight){
            enterNewScene = true;
            if(currentScene === 0) return;
            currentScene --;
            // document.body.setAttribute('id',`show-scene-${currentScene}`);
        }
        document.body.setAttribute('id',`show-scene-${currentScene}`);

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
        const scrollHeight = sceneInfo[currentScene].scrollHeight;

        switch(currentScene){

            case 0:
            // console.log("0play");
            // let sequence = Math.round(calcValues(values.imageSequence,currentYOffset));
            // objs.context.drawImage(objs.videoImages[sequence],0,0);
            objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);

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
            // let sequence2 = Math.round(calcValues(values.imageSequence,currentYOffset));

            // objs.context.drawImage(objs.videoImages[sequence2],0,0);
            if(scrollRatio <=0.1){
                objs.canvas.style.opacity = calcValues(values.canvas_opacity_in, currentYOffset);
            }
            else {
                objs.canvas.style.opacity = calcValues(values.canvas_opacity_out, currentYOffset);
            }

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

            // ----------------------------------------
            // currentScene 3에서 쓰는 캔버스를 미리 그려주기 시작
            if(scrollRatio >= 0.9){
                const objs = sceneInfo[3].objs; // 마지막 씬의 오브젝트들로 변수 변경
                const values = sceneInfo[3].values;
                const widthRatio = window.innerWidth / objs.canvas.width; // 비율
                const heightRatio = window.innerHeight / objs.canvas.height;
                let canvasScaleRatio;
                if(widthRatio <= heightRatio){
                    canvasScaleRatio = heightRatio; // 윈도우 창이 홀쭉한 경우
                } else {
                    canvasScaleRatio = widthRatio; // 윈도우 창이 가로로 넓은 경우
                }
    
    
                // 중앙정렬을 translate3d로 안하는 이유는 이 이미지는 처음부터 fixed 속성이 아니기 때문임
                // absolute일 경우 section-1로 올라가버리기 때문에 위 방법은 적합하지 않아서 display : flex 속성을 이용한다.
                objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
                objs.context.fillStyle = '#fff';
                objs.context.drawImage(objs.blendImage[0],0,0);
    
    
                // 캔버스 사이즈에 맞춰 가정한 innerWidth와 innerHeight ★★★★★
                const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio; // scroll너비를 뺀 document.body.offsetWidth
                const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;
                // 캔버스 사이즈에 맞춰 가정한 innerWidth와 innerHeight ★★★★★
                const whiteRectWidth = recalculatedInnerWidth * 0.15;
                
                values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
                values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
                values.rect2X[0] = recalculatedInnerWidth + values.rect1X[0] - whiteRectWidth;
                values.rect2X[1] = values.rect2X[0] + whiteRectWidth;
    
                objs.context.fillRect(values.rect1X[0],0,whiteRectWidth,recalculatedInnerHeight);
                objs.context.fillRect(values.rect2X[0],0,whiteRectWidth,recalculatedInnerHeight);
    
                
                

                
            }
            // ----------------------------------------
            break;

            case 3:
            // console.log("3play");
            const widthRatio = window.innerWidth / objs.canvas.width; // 비율
            const heightRatio = window.innerHeight / objs.canvas.height;
            let canvasScaleRatio;
            if(widthRatio <= heightRatio){
                canvasScaleRatio = heightRatio; // 윈도우 창이 홀쭉한 경우
            } else {
                canvasScaleRatio = widthRatio; // 윈도우 창이 가로로 넓은 경우
            }


            // 중앙정렬을 translate3d로 안하는 이유는 이 이미지는 처음부터 fixed 속성이 아니기 때문임
            // absolute일 경우 section-1로 올라가버리기 때문에 위 방법은 적합하지 않아서 display : flex 속성을 이용한다.
            objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
            objs.context.fillStyle = '#fff';
            objs.context.drawImage(objs.blendImage[0],0,0);


            // 캔버스 사이즈에 맞춰 가정한 innerWidth와 innerHeight ★★★★★ (가상의 캔버스)
            const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
            const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;
            const whiteRectWidth = recalculatedInnerWidth * 0.15;
            // 캔버스 사이즈에 맞춰 가정한 innerWidth와 innerHeight ★★★★★

            if(!values.rectStartY){
                values.rectStartY = objs.canvas.offsetTop + (objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2; // 부모 컨테이너로 부터 떨어진 top값 (css에서 scroll-section을 relative로 설정해야함)
                values.rect1X[2].start = (window.innerHeight / 2) / scrollHeight;
                values.rect2X[2].start = (window.innerHeight / 2) / scrollHeight;
                values.rect1X[2].end = values.rectStartY / scrollHeight;
                values.rect2X[2].end = values.rectStartY / scrollHeight;
            }

            // 흰색 박스 좌표
            values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
            values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
            values.rect2X[0] = recalculatedInnerWidth + values.rect1X[0] - whiteRectWidth;
            values.rect2X[1] = values.rect2X[0] + whiteRectWidth;
            
            // 결국 흰색박스도 같은 캔버스에 그려지는 것이므로 ..
            objs.context.fillRect(calcValues(values.rect1X,currentYOffset),0,parseInt(whiteRectWidth),recalculatedInnerHeight);
            objs.context.fillRect(calcValues(values.rect2X,currentYOffset),0,parseInt(whiteRectWidth),recalculatedInnerHeight);
            
            if(scrollRatio <= values.rect1X[2].end){
                objs.canvas.classList.remove('sticky');
            } else {
                objs.canvas.classList.add('sticky');
                // 줄어든 크기만큼 top값을 위로 올려야 한다.
                objs.canvas.style.top = `-${(objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2}px`;
                values.blendHeight[0] = 0;
                values.blendHeight[1] = objs.canvas.height;
                values.blendHeight[2].start = values.rect1X[2].end;
                values.blendHeight[2].end = values.blendHeight[2].start + 0.2;
                const blendHeight = calcValues(values.blendHeight,currentYOffset);
                
                // objs.context.drawImage(image,sx,sy,sWidth,sHeight, dx,dy,dWidth,dHeight) ★★★★★
                // 이미지 블렌드 시작
                objs.context.drawImage(objs.blendImage[1],
                    0,objs.canvas.height - blendHeight,objs.canvas.width,blendHeight,
                    0,objs.canvas.height - blendHeight,objs.canvas.width,blendHeight
                )
                
                if(scrollRatio >= values.blendHeight[2].end){ // 캔버스 scale 축소 시작
                    values.scaleNum[0] = canvasScaleRatio;
                    values.scaleNum[1] = document.body.offsetWidth / (objs.canvas.width * 1.5);
                    values.scaleNum[2].start = values.blendHeight[2].end;
                    values.scaleNum[2].end = values.scaleNum[2].start + 0.2;

                    objs.canvas.style.transform = `scale(${calcValues(values.scaleNum,currentYOffset)})`;
                    objs.canvas.style.marginTop = 0;
                    objs.canvasCaption.style.opacity = 0;
                }
                // canvas 위치 계산해보기 (marginTop을 이용)
                if(scrollRatio >= values.scaleNum[2].end && values.scaleNum[2].end > 0){ // 캔버스 scale 축소 종료
                    objs.canvas.classList.remove('sticky');
                    objs.canvas.style.marginTop = `${scrollHeight * 0.4}px`;

                    values.canvasCaption_opactiy[2].start = values.scaleNum[2].end;
                    values.canvasCaption_opactiy[2].end = values.canvasCaption_opactiy[2].start + 0.1;
                    values.canvasCaption_translateY[2].start = values.scaleNum[2].end;
                    values.canvasCaption_translateY[2].end = values.canvasCaption_translateY[2].start + 0.1;

                    objs.canvasCaption.style.opacity = calcValues(values.canvasCaption_opactiy,currentYOffset);
                    objs.canvasCaption.style.transform = `translate3d(0,${calcValues(values.canvasCaption_translateY,currentYOffset)}%,0)`;


                }

            }
            break;
        }
    }
    
    // 스크롤 할때 캔버스를 좀 더 부드럽게 처리하기 위해서 가속도를 조절하는 함수
    function loop(){
        delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc;
        
        if(!enterNewScene){
            if(currentScene === 0 || currentScene === 2){ // 섹션이 바뀌는 순간 생기는 오류를 방지하기 위해 분기
                const currentYOffset = delayedYOffset - prevScrollHeight;
                const objs = sceneInfo[currentScene].objs;
                const values = sceneInfo[currentScene].values;
                let sequence = Math.round(calcValues(values.imageSequence,currentYOffset)); // curruentYOffset 대신 가속도를 적용하여 yOffset을 변수로 전달한다
                if(objs.videoImages[sequence]){ // 번호에 해당하는 이미지가 존재 할 때만 캔버스 이미지를 출력
                    objs.context.drawImage(objs.videoImages[sequence],0,0);
                }
            }
        }
        
        rafId = requestAnimationFrame(loop);

        if(Math.abs(yOffset - delayedYOffset) < 1){
            cancelAnimationFrame(rafId);
            rafState = false;
        }
    }

    window.addEventListener('scroll', () => {
        yOffset = window.pageYOffset;
        scrollLoop();
        checkMenu();
        
        if(!rafState){
            rafId = requestAnimationFrame(loop);
            rafState = true;
        }

    });

    
    window.addEventListener('load',function(){
        setLayout();
        sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0],0,0);
    });
    // window.addEventListener('DOMContentLoaded',() =>{}); Html 구성만 로드가 완료되면 실행하는 이벤트 (이미지 로드x)
    
    window.addEventListener('resize',function(){
        if(window.innerWidth > 900){
            setLayout();
        }
        sceneInfo[3].values.rectStartY = 0;
    });
    
    window.addEventListener('orientationchange',setLayout); // 핸드폰 가로,세로로 바꿀때 생기는 이벤트
    setCanvasImage();

})();