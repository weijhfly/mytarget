
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  env: "release-5cd9c5",//这个就是环境id
  traceUser: true,
})

exports.main = async (event, context) => {
  const db = cloud.database();
  const _ = db.command;

  try {
    return await db.collection('sayingone').doc('XGrCysDR1TiNWNF1').update({
      data: {
        order: _.inc(1)
      }
    })
  } catch (e) {
    console.error(e)
  }
}

