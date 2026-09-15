import type { Moment } from '@/types'

/** 本地演示数据：接后端前用它跑通页面，接入后把 .env 里的 USE_MOCK 改成 false */
export const MOCK_MOMENTS: Moment[] = [
  {
    id: 'm_1001',
    title: '第一次在海边看日落',
    content: '浪一层层推上来，天从橘色慢慢变成深紫。什么都没做，就坐着看完了整场日落。',
    mood: 'calm',
    images: [],
    location: { name: '厦门 · 环岛路' },
    tags: ['旅行', '日落'],
    createdAt: '2026-09-14T18:40:00+08:00',
  },
  {
    id: 'm_1002',
    title: '妈妈做的红烧肉',
    content: '回家吃饭，还是熟悉的味道。顺手拍的小视频已经存进相册了。',
    mood: 'happy',
    images: [],
    location: { name: '家' },
    tags: ['家人', '美食'],
    createdAt: '2026-09-13T12:10:00+08:00',
  },
  {
    id: 'm_1003',
    title: '项目终于上线',
    content: '熬了两个月的版本发上去了，凌晨的办公室只有显示器在亮。',
    mood: 'excited',
    images: [],
    location: { name: '公司' },
    tags: ['工作', '里程碑'],
    createdAt: '2026-09-11T23:52:00+08:00',
  },
  {
    id: 'm_1004',
    title: '跑步 5 公里',
    content: '配速比上周快了 20 秒，风很大，跑完整个人都清醒了。',
    mood: 'happy',
    images: [],
    location: { name: '滨江绿道' },
    tags: ['运动'],
    createdAt: '2026-09-10T06:45:00+08:00',
  },
  {
    id: 'm_1005',
    title: '下了一整天的雨',
    content: '没出门，把拖了很久的书读完了一半，也可能是雨声太催眠。',
    mood: 'sad',
    images: [],
    tags: ['阅读'],
    createdAt: '2026-09-08T21:05:00+08:00',
  },
]
