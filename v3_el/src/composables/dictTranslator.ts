export const roomTypeMap: { [key: number]: string } = {
  2: '双人间',
  4: '四年间',
  6: '六人间'
};

export function getRoomTypeText(roomType: number): string {
  return roomTypeMap[roomType] || '';
}

export function getGenderText(gender: number): string {
  return gender === 1 ? '男' : '女'
}

export const roomStatusMap: { [key: number]: string } = {
  10: '空房',
  20: '已预定',
  30: '已入住',
  40: '已退房(待清理)',
  50: '维修中'
};

export function getRoomStatusText(roomStatus: number): string {
  return roomStatusMap[roomStatus] || '';
}

export const yesNoMap: { [key: number]: string } = {
  1: '是',
  0: '否'
};

export function getYesOrNoText(yesNo: number): string {
  return yesNoMap[yesNo] || '';
}

export const feeTypeMap: { [key: number]: string } = {
  10: '住宿费',
  20: '网费',
  30: '水费',
  40: '电费'
};

export function getFeeTypeText(feeType: number): string {
  return feeTypeMap[feeType] || '';
}

export const feePeriodTypeMap: { [key: number]: string } = {
  10: '月度',
  20: '年度',
  30: '季度'
};

export function getFeePeriodTypeText(feePeriodType: number): string {
  return feePeriodTypeMap[feePeriodType] || '';
}

export const checkInRecordStatusMap: { [key: number]: string } = {
  10: '已预定',
  20: '已入驻',
  30: '已取消',
  40: '已退房'
};

export function getCheckInRecordStatusText(status: number): string {
  return checkInRecordStatusMap[status] || '';
}

