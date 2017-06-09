//顶点数组
var vertices = [
    1.0, 1.0,
    1.0, -1.0, -1.0, 1.0, -1.0, -1.0
];
var v4PositionIndex = null;
var gl, programObject;

var image = new Image();
image.src = "test.jpg";
image.onload = function() {
    inverseGl();
}

//高斯模糊(待完成，默认为初始效果)
function blurGl() {
    renderGl('shader-fs');
}

//反色效果
function inverseGl() {
    renderGl('shader-fs-inverse');
}



/**
 * 渲染页面
 * 1.初始化webGL
 * 2.获得两个着色器
 * 3.生成着色器program对象，用以显卡渲染指令
 * 4.建立顶点坐标数组，将其绑定webGL
 * 5.载入图片纹理
 * 6.将纹理推送到着色器中
 * 7.清除颜色，坐标，
 * 8.通过坐标数组开始渲染
 * @param {any} fsh  片元着色器ID
 */
function renderGl(fsh) {
    var vsh = getScriptTextByID('shader-vs');
    var fsh = getScriptTextByID(fsh);
    init();
    getShader(vsh, fsh);
    initShaderProgram('position');
    //新建buffer
    var buffer = gl.createBuffer();
    //数组点坐标
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(vertices),
        gl.STATIC_DRAW);
    //用一个数组来为贴图纹理属性赋值
    gl.enableVertexAttribArray(v4PositionIndex);
    gl.vertexAttribPointer(v4PositionIndex, 2, gl.FLOAT, false, 0, 0);

    //载入图片纹理
    var texObj = createTextureByImg(image);

    //将载入的纹理指定为0号纹理
    gl.activeTexture(gl.TEXTURE0);
    var uniform = gl.getUniformLocation(programObject, "inputImageTexture");
    //将0这个值推送到着色器的uniform变量中，告诉着色器我们要使用0号纹理。
    gl.uniform1i(uniform, 0);

    //清除
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    //渲染数组坐标
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

// WebGL初始化
function init() {
    var myImg = document.getElementById('myImg');
    var canvas = document.getElementById("canvas");
    gl = canvas.getContext("experimental-webgl");
    if (gl == null)
        alert("你的浏览器不支持webgl");
    canvas.width = myImg.clientWidth;
    canvas.height = myImg.clientHeight;
    gl.viewport(0, 0, myImg.clientWidth, myImg.clientHeight)
}


/**
 * 初始化着色器Program，将着色器组合捆绑到program中
 * Program为WebGL对象，可看做显卡中运行指定指令的方法
 * 每个program可以储存一个片元着色器和一个顶点着色器。
 * @param {any} <script>标签中 position
 * @returns
 */
function initShaderProgram(positionName) {
    programObject = gl.createProgram();
    //初始化链接顶点着色器和片元着色器
    gl.attachShader(programObject, vertexShaderObject);
    gl.attachShader(programObject, fragmentShaderObject);
    gl.bindAttribLocation(programObject, v4PositionIndex, positionName);
    gl.linkProgram(programObject);
    if (!gl.getProgramParameter(programObject, gl.LINK_STATUS)) {
        alert(gl.getProgramInfoLog(programObject));
        return;
    }
    gl.useProgram(programObject);
}

/**
 * 根据着色器ID生成着色器
 * 
 * @param {any} vsh  顶点着色器对象
 * @param {any} fsh  片元着色器对象
 * @returns
 */
function getShader(vsh, fsh) {
    // 生成着色器对象
    vertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
    fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(vertexShaderObject, vsh);
    gl.shaderSource(fragmentShaderObject, fsh);
    gl.compileShader(vertexShaderObject);
    gl.compileShader(fragmentShaderObject);
    if (!gl.getShaderParameter(vertexShaderObject, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(vertexShaderObject) + "in vertex shader");
        return;
    }
    if (!gl.getShaderParameter(fragmentShaderObject, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(fragmentShaderObject) + "in fragment shader");
        return;
    }
}


/**
 * 通过图片创建纹理
 * 
 * @param {any} imgObj  图片对象
 * @returns
 */
function createTextureByImg(imgObj) {
    //把临时纹理绑定设定在0号。
    gl.activeTexture(gl.TEXTURE0);

    //创建纹理对象，并设置其属性。
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    //图片翻转,视情况而定
    // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // 加载图片
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    // 设置属性用以渲染不同场景
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    return texture;
}



/**
 * 通过scriptID获取着色器<script>标签中的内容
 * 
 * @param {any} scriptID
 * @returns
 */
function getScriptTextByID(scriptID) {
    var shaderScript = document.getElementById(scriptID);
    if (shaderScript == null) return "";

    if (shaderScript.textContent != null && shaderScript.textContent != "") {
        return shaderScript.textContent;
    }
    if (shaderScript.text != null && shaderScript.text != "") {
        return shaderScript.text;
    }
    var sourceCode = "";
    var child = shaderScript.firstChild;
    while (child) {
        if (child.nodeType == child.TEXT_NODE) sourceCode += child.textContent;
        child = child.nextSibling;
    }
    return sourceCode;
}