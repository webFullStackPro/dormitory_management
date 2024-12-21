export const roomTypeMap = {
  2: '双人间',
  4: '四年间',
  6: '六人间'
};

export function getRoomTypeText(roomType) {
  return roomTypeMap[roomType] || '';
}

export function getGenderText(gender) {
  return gender === 1 ? '男' : '女'
}

export const roomStatusMap = {
  10: '空房',
  20: '已预定',
  30: '已入住',
  40: '已退房(待清理)',
  50: '维修中'
};

export function getRoomStatusText(roomStatus) {
  return roomStatusMap[roomStatus] || '';
}

export const yesNoMap = {
  1: '是',
  0: '否'
};

export function getYesOrNoText(yesNo) {
  return yesNoMap[yesNo] || '';
}

export const feeTypeMap = {
  10: '住宿费',
  20: '网费',
  30: '水费',
  40: '电费'
};

export function getFeeTypeText(feeType) {
  return feeTypeMap[feeType] || '';
}

export const feePeriodTypeMap = {
  10: '月度',
  20: '年度',
  30: '季度'
};

export function getFeePeriodTypeText(feePeriodType) {
  return feePeriodTypeMap[feePeriodType] || '';
}

export const checkInRecordStatusMap = {
  10: '已预定',
  20: '已入驻',
  30: '已取消',
  40: '已退房'
};

export function getCheckInRecordStatusText(status) {
  return checkInRecordStatusMap[status] || '';
}

