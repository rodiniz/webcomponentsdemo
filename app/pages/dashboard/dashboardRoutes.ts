export const dashboardChildRoutes = [
	{ path: '/', component: 'dashboard-overview-page', load: () => import('./overview') },
	{ path: '/categories', component: 'list-categories-page', load: () => import('../category/listCategories') },
	{ path: '/categories/save', component: 'save-category-page', load: () => import('../category/savecategory') },
	{ path: '/categories/:id', component: 'save-category-page', load: () => import('../category/savecategory') },
	{ path: '/expenses', component: 'list-expenses-page', load: () => import('../expenses/listexpenses') },
	{ path: '/expenses/save', component: 'save-expense-page', load: () => import('../expenses/saveexpense') },
	{ path: '/expenses/:id', component: 'save-expense-page', load: () => import('../expenses/saveexpense') },
	{ path: '/incomes', component: 'list-income-page', load: () => import('../income/listincome') },
	{ path: '/incomes/save', component: 'save-income-page', load: () => import('../income/saveincome') },
	{ path: '/incomes/:id', component: 'save-income-page', load: () => import('../income/saveincome') },
];
