module.exports = {
    grant_type: 'client_credential',

    //chezheng
    //appid: 'wx903bcebe9afcdbc1',
    //secret: '46c459184a9c545773e5bf1ad6ee3a7a',

    //laoyou
    //appid: 'wx1063580e84d2c111',
    //secret: '6840cf0089c141b3c578b86954a522fc',

    //xinshi
    appid: 'wx1b3ada37970d5fb3',
    secret: '9f2edc0e4502136ad28d632664fb9a24',

    noncestr:'Wm3WZYTPz0wzccnW',
    accessTokenUrl:'https://api.weixin.qq.com/cgi-bin/token',
    ticketUrl:'https://api.weixin.qq.com/cgi-bin/ticket/getticket',
    cache_duration:1000*60*60*2 //缓存时长为2小时
}