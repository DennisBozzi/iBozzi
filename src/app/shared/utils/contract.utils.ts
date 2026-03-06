export function getDateProgress(
    validSince: string | Date,
    validUntil: string | Date
): number {
    const start = new Date(validSince);
    const end = new Date(validUntil);
    const today = new Date();

    const startTime = Date.UTC(
        start.getUTCFullYear(),
        start.getUTCMonth(),
        start.getUTCDate()
    );

    const endTime = Date.UTC(
        end.getUTCFullYear(),
        end.getUTCMonth(),
        end.getUTCDate()
    );

    const todayTime = Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate()
    );

    if (todayTime <= startTime) {
        return 1;
    }

    if (todayTime >= endTime) {
        return 100;
    }

    const total = endTime - startTime;
    const elapsed = todayTime - startTime;

    return Math.round((elapsed / total) * 100);
}

export function formatFileSize(bytes?: number): string {
    if (!bytes || bytes === 0) {
        return '0 B';
    }

    const k = 1024;
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const value = bytes / Math.pow(k, i);

    return `${value.toFixed(1)} ${units[i]}`;
}