
function createCanvas(rows,cols){
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext('2d');
	var cellWidth = canvas.width/cols;
	var cellHeight = canvas.height/rows;
	ctx.beginPath();
	for(var col = 1;col < cols;col++){
		var x = cellWidth * col;
		ctx.moveTo(x,0);
		ctx.lineTo(x,canvas.height);
	}
	for(var row = 1;row <rows;row++){
		var y = cellHeight * row;
		ctx.moveTo(0,y);
		ctx.lineTo(canvas.width,y);
	}
	ctx.strokeStyle = "aqua";
	ctx.stroke();
}

function prepareBlocks(rows,cols){
	var blocks = function(){
		var NO_BLOCK = 0;
		/**
		 * 网格置空
		 */
		var tetris_status = [];
		
		for(var i = 0;i < rows;i++){
			tetris_status[i] = [];
			for(var j = 0;j < cols;j++){
				tetris_status[i][j] = NO_BLOCK;
			}
		}
		

	}
}
/**
 * 方块种类list
 */
	var blocksArr = [
			//z
			[
				{x:20/2-1,y:0,color:1},
				{x:20/2,y:0,color:1},
				{x:20/2,y:1,color:1},
				{x:20/2+1,y:1,color:1}
			],
			//反 z
			[
				{x:20/2,y:0,color:2},
				{x:20/2+1,y:0,color:2},
				{x:20/2,y:1,color:2},
				{x:20/2-1,y:1,color:2}
			],
			//田
			[
				{x:20/2-1,y:0,color:3},
				{x:20/2,y:0,color:3},
				{x:20/2-1,y:1,color:3},
				{x:20/2,y:1,color:3}
			],
			//L
			[
				{x:20/2,y:0,color:4},
				{x:20/2,y:1,color:4},
				{x:20/2,y:2,color:4},
				{x:20/2+1,y:2,color:4}
			],
			//J
			[
				{x:20/2,y:0,color:5},
				{x:20/2,y:1,color:5},
				{x:20/2,y:2,color:5},
				{x:20/2-1,y:2,color:5}
			],
			//|
			[
				{x:20/2,y:0,color:6},
				{x:20/2,y:1,color:6},
				{x:20/2,y:2,color:6},
				{x:20/2,y:3,color:6}
			],
			//凸
			[
				{x:20/2,y:0,color:7},
				{x:20/2-1,y:1,color:7},
				{x:20/2,y:1,color:7},
				{x:20/2+1,y:1,color:7}
			]
		];
	
function initBlock(blocksArr){
	var rand = Math.floor(Math.random() * blocksArr.length);
	cur_Fall = [
		{x:blocksArr[rand][0].x,y:blocksArr[rand][0].y,
			color:blocksArr[rand][0].color},
		{x:blocksArr[rand][1].x,y:blocksArr[rand][1].y,
			color:blocksArr[rand][1].color},
		{x:blocksArr[rand][2].x,y:blocksArr[rand][2].y,
			color:blocksArr[rand][2].color},
		{x:blocksArr[rand][3].x,y:blocksArr[rand][3].y,
			color:blocksArr[rand][3].color},
	];
	rePaint();
	return cur_Fall;
};
/**
 * 方块的颜色数组
 */
var colors = ["white","red","green","blue","grey","yellow","black","orange"];
var tetris_status = initNetStatus();
/**
 *网格状态初始化 
 */
	function initNetStatus(){
		var status = new Array(20);
		for(var i = 0;i < 20;i++){
			status[i] = new Array(20);
			for(var j = 0;j < 20;j++){
				status[i][j] = 0;
			}
		}
		return status;
	}
	function moveDown(){
		if(checkDown()){
			paintWhite();
			/**
			 * 下落，方块的y坐标加一
			 */
			for(var i = 0;i < cur_Fall.length;i++){
				var cur = cur_Fall[i];
				cur.y++;
			}
			rePaint();
		}
		//不能向下掉落
		else{
			for(var i = 0;i < cur_Fall.length;i++){
				var cur = cur_Fall[i];
				if(cur.y < 2){
					//已经是输了，清空分数，速度等等，判断排名。
					localStorage.removeItem("Score");
					localStorage.removeItem("tetris_status");
					localStorage.removeItem("Speed");
					console.log("游戏结束");
//					isPlaying = false;
//					clearInterval(curTime);
//					return;
				}
				tetris_status[cur.y][cur.x] = cur.color;
			}
			initBlock(blocksArr);
			checkFullLines();
		}
	}
	function moveLeft(){
		if(checkLeft()){
			paintWhite();
			/**
			 * 左移，方块的x坐标减一
			 */
			for(var i = 0;i < cur_Fall.length;i++){
				var cur = cur_Fall[i];
				cur.x--;
			}
			rePaint();
		}
	}
	function moveRight(){
//		console.log(cur_Fall[0].x);
		if(checkRight()){
			paintWhite();
			/**
			 * 右移，方块的x坐标加一
			 */
			for(var i = 0;i < cur_Fall.length;i++){
				var cur = cur_Fall[i];
				cur.x++;
			}
			rePaint();
		}
	}
	function moveShift(){
		/**
		 * 检查转换之后是否超过边界，包括左边界，右边界，下边界
		 */
		var shiftPoint_x = cur_Fall[2].x;
		var shiftPoint_y = cur_Fall[2].y;
		var shifted_block = [];
		for(var k = 0;k < cur_Fall.length;k++){
			shifted_block.push({x:0,y:0});
		}
		for(var i = 0;i < cur_Fall.length;i++){
			shifted_block[i].x = shiftPoint_x + cur_Fall[i].y - shiftPoint_y;
			shifted_block[i].y = shiftPoint_y + shiftPoint_x - cur_Fall[i].x;
		}
		var canShift = true;
		for(var j = 0;j < cur_Fall.length;j++){
			if(shifted_block[j].x < 0 || shifted_block[j].x > 19){return canShift = false;}
			if(shifted_block[j].y < 0 || shifted_block[j].y > 19){return canShift = false;}
			if(tetris_status[shifted_block[j].y][shifted_block[j].x + 1] != 0)
			{return canShift = false;}
		}
		if(canShift){
			paintWhite();
			for(var l = 0;l<cur_Fall.length;l++){
				cur_Fall[l].x = shifted_block[l].x;
				cur_Fall[l].y = shifted_block[l].y;
			}
			rePaint();
		}
	}
	/**
	 * 方块刷成白色
	 */
	function paintWhite(){
		for(var i = 0;i < cur_Fall.length;i++){
			var cell = cur_Fall[i];
			rePaintCell(cell,"white");
		}
		
	}
	/**
	 * 重新上色
	 */
	function rePaint(){
		for(var i = 0;i < cur_Fall.length;i++){
			var cell = cur_Fall[i];
			var cellColor = colors[cell.color];
			rePaintCell(cell,cellColor);
//			console.log(cur.color);
		}
	}
	/**
	  *单个方块填色 
	  * @param {Object} cell 方块
	  * @param {Object} color 方块的颜色
	  */
	function rePaintCell(cell,color){
//			console.log(cell);
			var canvas = document.getElementById("myCanvas");
			var ctx = canvas.getContext('2d');
//			var cur = cur_Fall[i];
			var cellWidth = canvas.width/20;
			var cellHeight = canvas.height/20;
			ctx.fillStyle = color;
			ctx.fillRect(cell.x*cellWidth+1,cell.y*cellHeight+1,
				cellWidth-2,cellHeight-2);
	}
	/**
	 * 检查是否能往方向键移动
	 */
	function checkDown(){
		var canDown = true;
		for(var i = 0;i < cur_Fall.length;i++){
			if(cur_Fall[i].y >= 20 - 1){
				canDown = false;
				break;
			}
			if(tetris_status[cur_Fall[i].y + 1][cur_Fall[i].x] != 0	){
				canDown = false;
				break;
			}
		}
		return canDown;
	}
	function checkRight(){
		var canRight = true;
		for(var i = 0;i < cur_Fall.length;i++){
			if(cur_Fall[i].x > 20 - 1){
				canRight = false;
				break;
			}
			if(tetris_status[cur_Fall[i].y][cur_Fall[i].x + 1] != 0){
				canRight = false;
				break;
			}
		}
		return canRight;
	}
	function checkLeft(){
		var canLeft = true;
		for(var i = 0;i < cur_Fall.length;i++){
			if(cur_Fall[i].x < 1){
				canLeft = false;
				break;
			}
			if(tetris_status[cur_Fall[i].y][cur_Fall[i].x - 1] != 0){
				canLeft = false;
				break;
			}
		}
		return canLeft;
	}

	function drawBlock(){
		console.log("调用了drawBlock");
		for(var i = 19;i >= 0;i--){
			for(var j = 19;j >= 0;j--){
				if(tetris_status[i][j] != 0){
					var cell = {x:i,y:j,color:tetris_status[i][j]};
					var cellColor = colors[cell.color];
					rePaintCell(cell,cellColor);
//					console.log("有颜色");
				}else{
					var cell = {x:j,y:i,color:tetris_status[i][j]};
					rePaintCell(cell,"white");
//					console.log("没有颜色");
				}
			}
		}
	}
	var gameScore = 0;
	var gameSpeed = 1;
	
	function checkFullLines(){
		/**
		 * 消除行数，分为3步
		 * 1、检测是否满行 
		 * 2、消除，并算分 
		 * 3、剩余行下移	  
		 */
		console.log("调用了checkFullLines");
		for(var i = 0;i < 20;i++){
			var hasBlock = true;
			for(var j = 0;j < 20;j++){
				if(tetris_status[i][j] == 0){
					hasBlock = false;
					break;
				}
			}
			/**
			 * 消除并算分
			 */
			if(hasBlock){
				for(var j = 0;j < 20;j++){
					tetris_status[i][j] = 0;			
				}
				gameScore += 100;
				var showScore = document.getElementById("curScore");
				showScore.innerHTML = gameScore;
				/**
				 * 下移
				 */
				for(var k = i;k > 0;k--){
					for(var l = 0;l < 20;l++){
						tetris_status[k][l] = tetris_status[k-1][l];
					}
				}
				drawBlock();
			}
		}
		if(gameScore > 500*gameSpeed){speedUp();}
	}
	function speedUp(){
		var showSpeed = document.getElementById("curSpeed");
		showSpeed.innerHTML = gameSpeed++;
		setInterval("moveDown()",500/(gameSpeed-1)*2);
	}
	
	
		var gameStart = function(){
			createCanvas(20,20);
			initBlock(blocksArr);
			setInterval("moveDown()",500/(gameSpeed/2));
		}
			window.onkeydown = function myControl(e){
				/**
				 * 按键事件，控制方块的方向
				 * @param {Object} e
				 */
				var CompatibleKey;
			
				switch(e.keyCode){
	                case 37:
	                    CompatibleKey = 'ArrowLeft';
	                    moveLeft();
	                    break;
	                case 38:
	                    CompatibleKey = 'ArrowUp';
	                    moveShift();
	                    break;
	                case 39:
	                    CompatibleKey = 'ArrowRight';
	                    moveRight();
	                    break;
	                case 40:
	                    CompatibleKey = 'ArrowDown';
	                    moveDown();
	                    break;
	            }
			}

