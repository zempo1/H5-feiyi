
// 防抖函数
export function debouncePromise(fn, delay = 500) {
  let timer = null;
  return function (...args) {
    return new Promise((resolve, reject) => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(async () => {
        try {
          const res = await fn.apply(this, args);
          resolve(res);
        } catch (e) {
          console.error('函数执行失败:', e);
          reject(e);
        }
      }, delay);
    });
  };
}
export const formatCreatedAt = (timestamp) => {
    const [y,M,d,h,m,s] = timestamp;
    return new Date(y,M-1,d,h,m,s).getTime();
}

//格式化时间
export const formatTime = (timestamp) => {
    if (!timestamp) return '';

    let time;
    
    // 处理不同格式的时间戳
    if (Array.isArray(timestamp)) {
        // 原来的数组格式 [y,M,d,h,m,s]
        time = formatCreatedAt(timestamp)
    } else if (typeof timestamp === 'string') {
        // ISO字符串格式 (如 "2023-05-20T14:30:00.000Z")
        time = new Date(timestamp).getTime();
    } else if (typeof timestamp === 'number') {
        // 时间戳格式 (毫秒)
        time = timestamp;
    } else {
        console.warn('无法识别的时间格式:', timestamp);
        return '';
    }
    
    const now = new Date().getTime();
    const diff = now - time;
    
    // 小于1分钟
    if (diff < 60000) {
        return '刚刚';
    }
    // 小于1小时
    if (diff < 3600000) {
        return `${Math.floor(diff / 60000)}分钟前`;
    }
    // 小于1天
    if (diff < 86400000) {
        return `${Math.floor(diff / 3600000)}小时前`;
    }
    // 小于30天
    if (diff < 2592000000) {
        return `${Math.floor(diff / 86400000)}天前`;
    }
    
    // 超过30天显示具体日期
    const date = new Date(time);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};