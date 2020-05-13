import {defineConfig} from 'umi';

export default defineConfig({
    nodeModulesTransform: {
        type: 'none',
    },
    history: {type: 'hash'},
    routes: [
        {
            path: '/',
            title: '排课系统',
            component: '@/layouts/mainLayout',
            routes: [
                {path: "/", redirect: '/scheme', title: '排课系统'},
                {path: '/scheme', redirect: '/scheme/scheme', title: '排课方案'},
                {path: '/scheme/scheme', component: "@/pages/scheme/scheme", exact: true, title: "排课方案"},
                {path: '/scheme/setting', component: "@/pages/scheme/setting", exact: true, title: "排课设置"},
                {path: '/data/subject', component: "@/pages/data/subject", exact: true, title: "科目信息"},
                {path: '/data/teacher', component: "@/pages/data/teacher", exact: true, title: "教师信息"},
                {path: '/data/grade', component: "@/pages/data/grade", exact: true, title: "年级信息"},
                {path: '/data/class', component: "@/pages/data/class", exact: true, title: "班级信息"},
                {path: '/data/space', component: "@/pages/data/space", exact: true, title: "场地信息"},
                {path: '/rule/section', component: "@/pages/rule/section", exact: true, title: "课节设置"},
                {path: '/rule/classFixed', component: "@/pages/rule/classFixed", exact: true, title: "班级固排禁排"},
                {path: '/rule/teacherFixed', component: "@/pages/rule/teacherFixed", exact: true, title: "教师禁排"},
                {path: '/rule/subjectFixed', component: "@/pages/rule/subjectFixed", exact: true, title: "科目固排禁排"},
                {path: '/rule/spaceFixed', component: "@/pages/rule/spaceFixed", exact: true, title: "场地禁排"},
                {path: '/schedule/schedule', component: "@/pages/schedule/schedule", exact: true, title: "智能排课"},
                {path: '/schedule/timetable', component: "@/pages/schedule/timetable", exact: true, title: "智能课表"},
            ]
        },
    ],
    proxy: {
        "/timetable": {
            "target": "http://127.0.0.1:80/",
            "changeOrigin": true
        },
    }
});
