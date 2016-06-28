module.exports = {
    grant_type: 'client_credential',
    appid: 'wx903bcebe9afcdbc1',
    secret: '6840cf0089c141b3c578b86954a522fc',
    noncestr:'wx1063580e84d2c111',
    accessTokenUrl:'https://api.weixin.qq.com/cgi-bin/token',
    ticketUrl:'https://api.weixin.qq.com/cgi-bin/ticket/getticket',
    cache_duration:1000*60*60*2 //缓存时长为2小时
}