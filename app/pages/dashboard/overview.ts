import '@diniz/webcomponents';
import Chart from 'chart.js/auto';
import template from './overview.html?raw';
import { http } from '@diniz/webcomponents';

type ExpenseByCategoryItem = {
    category: string;
    total: number;
};

type DashboardSummaryResponse = {
    incomeTotal: number;
    expenseTotal: number;
    balance: number;
    transactionCount: number;
    expenseByCategory?: ExpenseByCategoryItem[];
};

export class DashboardOverviewPage extends HTMLElement {
    private expenseByCategoryChart: Chart<'pie', number[], string> | null = null;

    connectedCallback(): void {
        if (!this.hasChildNodes()) {
            this.innerHTML = template;
        }

        this.setDefaultCurrentMonthRange();
        this.bindDateEvents();
        void this.loadSummary();
    }

    disconnectedCallback(): void {
        this.expenseByCategoryChart?.destroy();
        this.expenseByCategoryChart = null;
    }

    private setDefaultCurrentMonthRange(): void {
        const fromInput = this.querySelector('#dashboard-date-from') as { value?: string } | null;
        const toInput = this.querySelector('#dashboard-date-to') as { value?: string } | null;

        const hasFrom = typeof fromInput?.value === 'string' && fromInput.value.trim().length > 0;
        const hasTo = typeof toInput?.value === 'string' && toInput.value.trim().length > 0;

        if (hasFrom || hasTo) {
            return;
        }

        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const toInputFormat = (date: Date): string => {
            const [datePart] = date.toISOString().split('T');
            return datePart ?? '';
        };

        if (fromInput) {
            fromInput.value = toInputFormat(firstDay);
        }

        if (toInput) {
            toInput.value = toInputFormat(lastDay);
        }
    }

    private bindDateEvents(): void {
        const fromInput = this.querySelector('#dashboard-date-from') as HTMLElement | null;
        const toInput = this.querySelector('#dashboard-date-to') as HTMLElement | null;

        const refresh = (): void => {
            void this.loadSummary();
        };

        fromInput?.addEventListener('change', refresh);
        fromInput?.addEventListener('date-change', refresh as EventListener);
        toInput?.addEventListener('change', refresh);
        toInput?.addEventListener('date-change', refresh as EventListener);
    }

    private getDateInputValue(id: string): string {
        const input = this.querySelector(id) as { value?: string } | null;
        const value = input?.value;
        return typeof value === 'string' ? value.trim() : '';
    }

    private formatCurrency(value: number): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(value);
    }

    private updateRangeLabel(from: string, to: string): void {
        const label = this.querySelector('#overview-range-label') as HTMLElement | null;
        if (!label) {
            return;
        }

        if (!from && !to) {
            label.textContent = 'All dates';
            return;
        }

        if (from && to) {
            label.textContent = `${from} - ${to}`;
            return;
        }

        label.textContent = from ? `From ${from}` : `Until ${to}`;
    }

    private async loadSummary(): Promise<void> {
        const from = this.getDateInputValue('#dashboard-date-from');
        const to = this.getDateInputValue('#dashboard-date-to');

        this.updateRangeLabel(from, to);

        const params = new URLSearchParams();
        if (from) {
            params.set('from', from);
        }
        if (to) {
            params.set('to', to);
        }

        const url = params.size > 0
            ? `/api/dashboardsummary?${params.toString()}`
            : '/api/dashboardsummary';

        try {
            const response = await http.get(url);
          
            const data = await response as DashboardSummaryResponse;

            const incomeTotal = this.querySelector('#income-total') as HTMLElement | null;
            const expenseTotal = this.querySelector('#expense-total') as HTMLElement | null;
            const balanceTotal = this.querySelector('#balance-total') as HTMLElement | null;
            const transactionCount = this.querySelector('#transaction-count') as HTMLElement | null;

            if (incomeTotal) {
                incomeTotal.textContent = this.formatCurrency(Number(data.incomeTotal ?? 0));
            }

            if (expenseTotal) {
                expenseTotal.textContent = this.formatCurrency(Number(data.expenseTotal ?? 0));
            }

            if (balanceTotal) {
                balanceTotal.textContent = this.formatCurrency(Number(data.balance ?? 0));
            }

            if (transactionCount) {
                transactionCount.textContent = new Intl.NumberFormat('en-US').format(Number(data.transactionCount ?? 0));
            }

            this.renderExpenseByCategoryChart(data.expenseByCategory ?? []);
        } catch {
            return;
        }
    }

    private renderExpenseByCategoryChart(expenseByCategory: ExpenseByCategoryItem[]): void {
        const canvas = this.querySelector('#expenses-by-category-chart') as HTMLCanvasElement | null;
        if (!canvas) {
            return;
        }

        const labels = expenseByCategory.length > 0
            ? expenseByCategory.map((item) => item.category)
            : ['No expenses'];

        const values = expenseByCategory.length > 0
            ? expenseByCategory.map((item) => Number(item.total))
            : [1];

        const palette = [
            '#60A5FA', '#F87171', '#34D399', '#FBBF24', '#A78BFA',
            '#22D3EE', '#FB7185', '#4ADE80', '#F59E0B', '#818CF8',
        ];

        const backgroundColor = expenseByCategory.length > 0
            ? values.map((_, index) => palette[index % palette.length])
            : ['#CBD5E1'];

        this.expenseByCategoryChart?.destroy();
        this.expenseByCategoryChart = new Chart(canvas, {
            type: 'pie',
            data: {
                labels,
                datasets: [
                    {
                        data: values,
                        backgroundColor,
                        borderColor: '#ffffff',
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            boxWidth: 12,
                            boxHeight: 12,
                        },
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const value = Number(context.raw ?? 0);
                                return `${context.label}: ${this.formatCurrency(value)}`;
                            },
                        },
                    },
                },
            },
        });
    }
}

customElements.define('dashboard-overview-page', DashboardOverviewPage);