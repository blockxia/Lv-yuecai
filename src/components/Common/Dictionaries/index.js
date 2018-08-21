const STATUS = [
  {
    id: 1,
    name: "跟进中"
  },
  {
    id: 2,
    name: "初审"
  },
  {
    id: 3,
    name: "复审"
  },
  {
    id: 4,
    name: "合同审批"
  },
  {
    id: 5,
    name: "已签约"
  },
  {
    id: 6,
    name: "已立项"
  },
]
const TYPE = [
  {
    id: 1,
    name: "酒店"
  },
  {
    id: 2,
    name: "民宿"
  },
  {
    id: 3,
    name: "客栈"
  },
  {
    id: 4,
    name: "公寓"
  },
]
const PS = [
  {
    id: 1,
    name: "停业"
  },
  {
    id: 2,
    name: "在营"
  },
  {
    id: 3,
    name: "荒废"
  },
  {
    id: 4,
    name: "空地"
  },
  {
    id: 5,
    name: "混凝土清水房"
  },
]

const CT = [
  {
    id: 1,
    name: "自营"
  },
  {
    id: 2,
    name: "合营"
  },
  {
    id: 3,
    name: "加盟"
  },
  {
    id: 4,
    name: "保底经营"
  }
]

const NR = [
  {
    id: 1,
    name: "需要改建"
  },
  {
    id: 2,
    name: "不需改建"
  },
]

const AB = [
  {
    id: 1,
    name: "自有"
  },
  {
    id: 2,
    name: "租赁"
  },
  {
    id: 3,
    name: "共有"
  },
]

const CI = [
  {
    id: 1,
    name: "A-强烈"
  },
  {
    id: 2,
    name: "B-积极	"
  },
  {
    id: 3,
    name: "C-一般"
  },
  {
    id: 4,
    name: "D-消极"
  },
]
 const BRAND = [
   {
    id: 1,
    name: "亚朵"
  },
  {
    id: 2,
    name: "花间堂"
  },
  {
    id: 3,
    name: "久栖"
  },
  {
    id: 4,
    name: "心宿"
  },
  {
    id: 5,
    name: "邂逅时光"
  },
  {
    id: 6,
    name: "阳光纳里"
  },
  {
    id: 7,
    name: "亲的客栈"
  },
  {
    id: 8,
    name: "游多多"
  },
  {
    id: 9,
    name: "登巴"
  },
  {
    id: 10,
    name: "童话"
  },
  {
    id: 11,
    name: "东方客栈"
  },
  {
    id: 12,
    name: "喜悦秘境"
  },
  {
    id: 13,
    name: "山水间"
  },
  {
    id: 14,
    name: "西坡"
  },
  {
    id: 15,
    name: "原舍"
  },
  {
    id: 16,
    name: "过云山居"
  },
  {
    id: 17,
    name: "千里走单骑"
  },
  {
    id: 18,
    name: "寒舍"
  },
  {
    id: 19,
    name: "松赞"
  }
 ]
const LEVEL = [
  {
    id: 1,
    name: "A-优良"
  },
  {
    id: 2,
    name: "B-较好"
  },
  {
    id: 3,
    name: "C-一般"
  },
]
const SCORE = [
  {
    id: 0,
    name: 0
  },
  {
    id: 1,
    name: 1
  },
  {
    id: 2,
    name: 2
  },
  {
    id: 3,
    name: 3
  },
  {
    id: 4,
    name: 4
  },
  {
    id: 5,
    name: 5
  },
]
const RD = [
  {
    id: 1,
    name: "花筑∙城市"
  },
  {
    id: 2,
    name: "花筑∙索性"
  },
  {
    id: 3,
    name: "花筑∙奢"
  },
  {
    id: 4,
    name: "花筑∙悦"
  },
  {
    id: 5,
    name: "花筑"
  },
]
const SL = [
  {
    id: 1,
    name: "五星"
  },
  {
    id: 2,
    name: "四星"
  },
  {
    id: 3,
    name: "三星"
  },
]
const GS = [
  {
    id: 1,
    name: "是"
  },
  {
    id: 2,
    name: "否"
  },
]
const YEARS = [
  {
    id: "2018",
    name: "2018年"
  },
  {
    id: "2017",
    name: "2017年"
  },
  {
    id: "2016",
    name: "2016年"
  },
  {
    id: "2015",
    name: "2015年"
  },
  {
    id: "2014",
    name: "2014年"
  },
  {
    id: "2013",
    name: "2013年"
  },
  {
    id: "2012",
    name: "2012年"
  },
  {
    id: "2011",
    name: "2011年"
  },
  {
    id: "2010",
    name: "2010年"
  },
  {
    id: "2009",
    name: "2010年以前"
  }
]
const MONTH = [
  {
    id: "1",
    name: "1月"
  },
  {
    id: "2",
    name: "2月"
  },
  {
    id: "3",
    name: "3月"
  },
  {
    id: "4",
    name: "4月"
  },
  {
    id: "5",
    name: "5月"
  },
  {
    id: "6",
    name: "6月"
  },
  {
    id: "7",
    name: "7月"
  },
  {
    id: "8",
    name: "8月"
  },
  {
    id: "9",
    name: "9月"
  },
  {
    id: "10",
    name: "10月"
  },
  {
    id: "11",
    name: "11月"
  },
  {
    id: "12",
    name: "12月"
  },
  
]
const VISITS = [
  {
    name:"电话沟通",
    id:1,
  },
  {
    name:"邮件沟通",
    id:2
  },
  {
    name:"上门拜访",
    id:3
  },
  {
    name:"会议拜访",
    id:4
  },
  {
    name:"其他",
    id:5
  },
  ];
const PERSON_TYPE = [
  {
    name:"业主",
    id:1,
  },
  {
    name:"KP",
    id:2
  },
  {
    name:"老板",
    id:3
  },
  {
    name:"决策人	",
    id:4
  },
  {
    name:"推荐人",
    id:5,
  },
  {
    name:"操作人",
    id:6
  },
  {
    name:"对接人",
    id:7
  },
  {
    name:"其他",
    id:8
  },
]
export {BRAND,CT,NR,CI,TYPE,PS,LEVEL,AB,SCORE,RD,SL,STATUS,GS,YEARS,MONTH,PERSON_TYPE,VISITS}