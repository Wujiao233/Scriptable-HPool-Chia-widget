
const dbheader = {
    Referer: `https://www.hpool.com/center/mining`,
    // 修改为你的HPool Cookie
    // Change to your HPool Cookie
    Cookie: `{cookies}`
};

let res = await loadData(dbheader);
var result = calc(res);
let widget = await createWidget(result)

if (!config.runsInWidget) {
  await widget.presentMedium()
}
// Tell the system to show the widget.
Script.setWidget(widget)
Script.complete()


async function createWidget(items) {
    let strDate = timestampToTime(items[1])
    let gradient = new LinearGradient()
    gradient.locations = [0, 1]
    gradient.colors = [
      new Color("#33c8d9"),
      new Color("#1ec6ee")
    ]
    let w = new ListWidget()
    // if (imgURL != null) {
    //   let imgReq = new Request(imgURL)
    //   let img = await imgReq.loadImage()
    //   w.backgroundImage = img
    // }
    w.backgroundColor = new Color("#33c8d9")
    w.backgroundGradient = gradient
    // Add spacer above content to center it vertically.
    w.addSpacer(4)
    // Show article headline.
    let titleTxt = w.addText("HPool Chia")
    titleTxt.font = Font.boldSystemFont(16)
    titleTxt.textColor = Color.white()
    // Add spacing below headline.
    w.addSpacer(2)
    // Show authors.
    let authorsTxt = w.addText("更新时间：" + strDate)
    authorsTxt.font = Font.mediumSystemFont(11)
    authorsTxt.textColor = Color.white()
    authorsTxt.textOpacity = 0.8
    // Add spacing below authors.
    w.addSpacer(2)
    // Show date.
    let dateTxt = w.addText("实时：" + items[0].toFixed(8))
    dateTxt.font = Font.mediumSystemFont(12)
    dateTxt.textColor = Color.white()
    dateTxt.textOpacity = 0.9
    // Add spacing below content to center it vertically.
    w.addSpacer(2)
    let date2Txt = w.addText("昨日：" + items[2].toFixed(8))
    date2Txt.font = Font.mediumSystemFont(12)
    date2Txt.textColor = Color.white()
    date2Txt.textOpacity = 0.9
    w.addSpacer(2)
    return w
}

function timestampToTime(timestamp) {
    var date = new Date(timestamp*1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
    var s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
    
    strDate = Y+M+D+h+m+s;
    return strDate;
}

function calc(data){
    var result = 0;
    var max_time = 0
    var last_set = 0
    data['data']['list'].forEach(function (item,i){
        if(item['status']=="0"){
            result += parseFloat(item['block_reward'])
            if(item['record_time'] > max_time){
                max_time = item['record_time'];
            }
        }
        if(item["height"].indexOf("-")>0 && last_set ==0){
          last_set = parseFloat(item["block_reward"])
        }
    });
    return [result,max_time,last_set]
}

async function loadData(header){
    const request = new Request('');
    request.url = 'https://www.hpool.com/api/pool/miningdetail?language=zh&type=chia&count=100&page=1';
    request.method = 'POST';
    request.headers = header;
    const data = await request.loadJSON();
    return data;
}
