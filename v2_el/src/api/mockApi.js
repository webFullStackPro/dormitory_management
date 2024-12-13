export default class mockApi {
  static operateSuccessfully () {
  return Promise.resolve({
      status: 200,
      data: {
        code: 1,
        msg: '操作成功'
      }
    })
  }

  static operateSuccessfullyWithData (data) {
    return Promise.resolve({
      status: 200,
      data: {
      code: 1,
      msg: '操作成功',
      data: Object.assign({}, data)
      }
    })
  }

  static operateUnsuccessfully () {
    return Promise.resolve({
      status: 200,
      data: {
      code: 0,
      msg: '操作失败'
      }
    })
  }

  static queryPageSuccessfully (total, data) {
    return Promise.resolve({
      status: 200,
      data: {
      code: 1,
      msg: '操作成功',
      data: {
          total: total,
          list: Object.assign([], data)
      }
      }
    })
  }

  static queryByIdSuccessfully (data) {
    return Promise.resolve({
      status: 200,
      data: {
      code: 1,
      msg: '操作成功',
      data: Object.assign({}, data)
      }
    })
  }
}