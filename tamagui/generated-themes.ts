type Theme = {
  background: string;
  backgroundFocus: string;
  backgroundHover: string;
  backgroundPress: string;
  backgroundStrong: string;
  backgroundTransparent: string;
  borderColor: string;
  borderColorFocus: string;
  borderColorHover: string;
  borderColorPress: string;
  color: string;
  colorFocus: string;
  colorHover: string;
  colorPress: string;
  colorTransparent: string;
  placeholderColor: string;
  shadowColor: string;
  shadowColorFocus: string;
  shadowColorHover: string;
  shadowColorPress: string;

}

function t(a) {
  let res: Record<string, string> = {}
  for (const [ki, vi] of a) {
    // @ts-ignore
    res[ks[ki]] = vs[vi]
  }
  return res
}
const vs = [
  '#f8f8f8',
  'transparent',
  '#1d2445',
  '#1d2445CC',
  '#1d244533',
  '#ffffff',
  '#ffffffCC',
  '#1b4650',
  '#ffffff33',
  '#6ddc91',
  '#b33349',
]

const ks = [
'background',
'backgroundFocus',
'backgroundHover',
'backgroundPress',
'backgroundStrong',
'backgroundTransparent',
'borderColor',
'borderColorFocus',
'borderColorHover',
'borderColorPress',
'color',
'colorFocus',
'colorHover',
'colorPress',
'colorTransparent',
'placeholderColor',
'shadowColor',
'shadowColorFocus',
'shadowColorHover',
'shadowColorPress']


const n1 = t([[0, 0],[1, 0],[2, 0],[3, 0],[4, 0],[5, 1],[6, 2],[7, 2],[8, 2],[9, 2],[10, 2],[11, 2],[12, 2],[13, 2],[14, 1],[15, 3],[16, 4],[17, 4],[18, 4],[19, 4]]) as Theme

export const base = n1 as Theme
const n2 = t([[0, 5],[1, 5],[2, 5],[3, 5],[4, 5],[5, 1],[6, 2],[7, 2],[8, 2],[9, 2],[10, 2],[11, 2],[12, 2],[13, 2],[14, 1],[15, 6],[16, 4],[17, 4],[18, 4],[19, 4]]) as Theme

export const secondary = n2 as Theme
const n3 = t([[0, 7],[1, 7],[2, 7],[3, 7],[4, 7],[5, 1],[6, 8],[7, 8],[8, 8],[9, 8],[10, 5],[11, 5],[12, 5],[13, 5],[14, 1],[15, 3],[16, 3],[17, 3],[18, 3],[19, 3]]) as Theme

export const popPetrol = n3 as Theme
const n4 = t([[0, 9],[1, 9],[2, 9],[3, 9],[4, 9],[5, 1],[6, 2],[7, 2],[8, 2],[9, 2],[10, 2],[11, 2],[12, 2],[13, 2],[14, 1],[15, 3],[16, 4],[17, 4],[18, 4],[19, 4]]) as Theme

export const stromeeGreen = n4 as Theme
const n5 = t([[0, 10],[1, 10],[2, 10],[3, 10],[4, 10],[5, 1],[6, 2],[7, 2],[8, 2],[9, 2],[10, 5],[11, 5],[12, 5],[13, 5],[14, 1],[15, 6],[16, 4],[17, 4],[18, 4],[19, 4]]) as Theme

export const lollipopRed = n5 as Theme