let userIdentifier

let zipFile
const warn_text = document.getElementById('warning')
const submitbtn = document.getElementById('btn')
const fileBox = document.getElementById('file_box')
let trlist = document.getElementsByTagName('tr')

window.onload = function(){
    userIdentifier = getCookie();
    if(!userIdentifier){
        warn_text.innerHTML = "请先前往 <a href='https://lab.glimmer.org.cn/auth' target='_blank'>https://lab.glimmer.org.cn/auth</a> 登录"
    }else{
        showRank()
        warn_text.innerText = ''
    }
}

window.document.onvisibilitychange = function () {
    userIdentifier = getCookie();
    if(window.document.visibilityState === 'visible'){
        if(!userIdentifier){
            warn_text.innerHTML = "请先前往 <a href='https://lab.glimmer.org.cn/auth' target='_blank'>https://lab.glimmer.org.cn/auth</a> 登录"
        }else{
            showRank()
            warn_text.innerText = ''
        }
    }
}

function showRank(){
    var request = new XMLHttpRequest();
    request.open("GET", 'https://brifin.top:40001/rank?token=' + userIdentifier);
    request.send(null);
    request.onload = function () {
        if (request.status == 200) {
            const dataList = JSON.parse(request.responseText);
            const ranks = dataList.rank
            const len = ranks.length
            const err = ranks[6][4]
            for(let i=0;i < len;i++){
                kids = trlist[i+1].children
                kid_len = kids.length
                if(ranks[i] != null){
                    if(i < 5){
                        for(let j = 1;j < kid_len;j++){
                            kids[j].innerText = ranks[i][j-1]
                        }
                    }else{
                        if(err != '' && i == 6){
                            kids[4].innerText = err
                        }else{
                            for(let j = 0;j < kid_len;j++){
                                if(j == 0){
                                    kids[j].innerText = ranks[i][j]
                                }else if (j>1){
                                    kids[j].innerText = ranks[i][j-1]
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

fileBox.onclick = function cancel(){
    fileBox.value = null
}

fileBox.onchange = function exec_file(event) {
    if(!userIdentifier){
        warn_text.innerHTML = "请先前往 <a href='https://lab.glimmer.org.cn/auth' target='_blank'>https://lab.glimmer.org.cn/auth</a> 登录"
        fileBox.value = null
        return
    }
    let files = event.target.files
    if (files.length) {
        let file = files[0]
        if (file.name != 'mymodel.tar' || file.ssize > 104857600) {
            warn_text.innerText = "上传文件不规范！"
        } else {
            warn_text.innerText = "预备上传"
            zipFile = file
        }
    }
}

submitbtn.onclick = function modelSubmit() {
    if(!userIdentifier){
        warn_text.innerText = "请先前往 <a href='https://lab.glimmer.org.cn/auth' target='_blank'>https://lab.glimmer.org.cn/auth</a> 登录"
        fileBox.value = null
        return
    }
    if (zipFile) {
        let xhr = new XMLHttpRequest()
        xhr.open('POST', 'https://brifin.top:40001/submit?token=' + userIdentifier)
        xhr.send(zipFile)
        warn_text.innerText = "上传中...请不要退出"
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status < 300) {
                var data = JSON.parse(xhr.responseText)
                if (data.status >= 300) {
                    warn_text.innerText = "上传失败"
                }else{
					warn_text.innerText = "上传成功，请稍等刷新页面查看结果"
				}
                console.log(data)
            }
        }
        xhr.upload.onload = function () {
            warn_text.innerText = "上传成功，请稍等刷新页面查看结果"
        }
    } else {
        warn_text.innerText = "没有选中文件"
    }
}

function getCookie() {
    const value = `; ${document.cookie}`;
    const parts = value.split("; token=");
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}
  