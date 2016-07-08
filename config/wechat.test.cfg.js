module.exports = {
    grant_type: 'client_credential',
    appid: 'wx22c8641086c52351',
    secret: 'a821ab36f981060789f353f73b6ccf6b',
    noncestr:'wx1063580e84d2c222',
    accessTokenUrl:'https://api.weixin.qq.com/cgi-bin/token',
    ticketUrl:'https://api.weixin.qq.com/cgi-bin/ticket/getticket',
    cache_duration:1000*60*60*2 //缓存时长为2小时
}