/**
 * querySelectorで指定する'.'繋ぎのクラス名を作成
 */
export const createClassName = (className: string): string => {
    return className
        .split(' ')
        .map((className) => '.' + className)
        .join('');
};
