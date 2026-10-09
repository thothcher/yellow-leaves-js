'use strict';

/* =========================================================
   1. DATA — the 8 topics, chained in learning order.
      One running example ("the leaf garden") flows through all of them.
   ========================================================= */

const TOPICS = [
    {
        id: 'variables',
        title: 'ცვლადები',
        en: 'Variables',
        label: 'ცვლადი',
        icon: 'box',
        summary: 'ცვლადი არის ყუთი, რომელშიც მნიშვნელობას ვინახავთ: ტექსტს, რიცხვს, სიას. ყველაფერი დანარჩენი ამაზეა დაშენებული.',
        analogy: 'ცვლადი ჰგავს ყუთს, რომელსაც წარწერა აქვს. წარწერა ცვლადის სახელია (leaves), შიგნით კი მნიშვნელობა დევს (5). როცა სახელს წერ, JS ყუთს ხსნის და შიგთავსს იღებს.',
        keyPoints: [
            'const: ყუთში სხვა მნიშვნელობას ვერ ჩადებ',
            'let: შიგთავსი შეიძლება შეიცვალოს',
            'typeof გეუბნება, რა ტიპის მნიშვნელობა დევს ყუთში',
        ],
        bridge: 'აქ იწყება ბაღი: ვინახავთ, რამდენი ფოთოლია და როგორია ხე.',
        code: `// ბაღის მდგომარეობა
const gardenName = 'ფოთლების ბაღი';     // string
let leaves = 5;                          // number
let isAutumn = false;                    // boolean
const colors = ['green', 'yellow'];      // array
const tree = { name: 'მუხა', age: 12 };  // object
let wind;                                // undefined`,
        more: {
            title: 'მონაცემთა ტიპები და გამოცხადება',
            points: [
                '<code>String</code>: ტექსტი ბრჭყალებში, <code>\'მუხა\'</code>',
                '<code>Number</code>: მთელი და ათწილადი, <code>5</code>, <code>3.14</code>',
                '<code>Boolean</code>: მხოლოდ <code>true</code> ან <code>false</code>',
                '<code>Array</code>: დალაგებული სია, <code>[1, 2, 3]</code>; ინდექსი 0-დან იწყება',
                '<code>Object</code>: გასაღები და მნიშვნელობა, <code>{ name: \'მუხა\' }</code>',
                '<code>undefined</code>: ცვლადი გამოცხადებულია, მნიშვნელობა არ აქვს',
                '<code>const</code>: ხელახლა ვერ მიანიჭებ. ყველაზე ხშირად ეს გამოიყენე',
                '<code>let</code>: მნიშვნელობა შეიძლება შეიცვალოს, ბლოკში ცოცხლობს <code>{ }</code>',
                '<code>var</code>: ძველი სტილი, ფუნქციის scope-ით მუშაობს. ახალ კოდში აღარ გამოიყენება',
            ],
            code: `const tree = { name: 'მუხა' };
tree.name = 'ცაცხვი'; // OK: შიგთავსი იცვლება
tree = {};            // TypeError: const-ს ხელახლა ვერ მიანიჭებ

typeof 'მუხა'  // 'string'
typeof 5       // 'number'
typeof []      // 'object' ← მასივიც ობიექტია!`,
            tip: '<code>const</code> ნიშნავს, რომ ცვლადს სხვა მნიშვნელობას ვერ მიანიჭებ. ობიექტი და მასივი მის შიგნით მაინც იცვლება.',
        },
        run() {
            const gardenName = 'ფოთლების ბაღი';
            const leaves = 5;
            const isAutumn = false;
            const colors = ['green', 'yellow'];
            const tree = { name: 'მუხა', age: 12 };
            let wind;
            return [
                `gardenName → ${typeof gardenName}  "${gardenName}"`,
                `leaves     → ${typeof leaves}  ${leaves}`,
                `isAutumn   → ${typeof isAutumn}  ${isAutumn}`,
                `colors     → ${Array.isArray(colors) ? 'array' : typeof colors}  [${colors.join(', ')}]`,
                `tree       → ${typeof tree}  ${JSON.stringify(tree)}`,
                `wind       → ${typeof wind}`,
            ].join('\n');
        },
    },
    {
        id: 'conditions',
        title: 'პირობები',
        en: 'Conditions',
        label: 'პირობა',
        icon: 'split',
        summary: 'პირობა წყვეტს, კოდის რომელი ნაწილი შესრულდეს. ამისთვის ცვლადის მნიშვნელობას ამოწმებს.',
        analogy: 'პირობა გზაჯვარედინს ჰგავს: „თუ წვიმს, ქოლგას ავიღებ, თუ არა და სათვალეს“. JS კითხვას სვამს, პასუხი true ან false-ია, და ერთ-ერთ გზას ირჩევს.',
        keyPoints: [
            'if ამოწმებს, true-ა თუ false',
            'switch მოსახერხებელია ბევრი ვარიანტისთვის',
            'შედარებისთვის ყოველთვის === გამოიყენე',
        ],
        bridge: 'ცვლადში შენახულ leaves-ს ვამოწმებთ და ვწყვეტთ, რა ვქნათ.',
        code: `if (leaves > 10) {
  status = 'ხე ხშირფოთლიანია';
} else if (leaves > 0) {
  status = 'ფოთლები ცოტაა';
} else {
  status = 'ხე შიშველია';
}

switch (season) {
  case 'autumn': color = 'yellow'; break;
  case 'winter': color = 'none';   break;
  default:       color = 'green';
}`,
        more: {
            title: 'if, switch და სხვა',
            points: [
                '<code>if / else if / else</code>: ამოწმებს ზემოდან ქვემოთ, სრულდება პირველი true',
                '<code>switch</code>: მოსახერხებელია, როცა ერთ მნიშვნელობას ბევრ ვარიანტს ადარებ',
                '<code>break</code>: switch-ში არ დაგავიწყდეს, თორემ შემდეგი case-იც შესრულდება',
                '<code>a ? b : c</code>: ternary, ანუ მოკლე if ერთ ხაზზე',
                '<code>===</code>: ადარებს მნიშვნელობასაც და ტიპსაც. ყოველთვის ეს გამოიყენე',
                'Falsy მნიშვნელობები: <code>0</code>, <code>\'\'</code>, <code>null</code>, <code>undefined</code>, <code>NaN</code>, <code>false</code>',
                '<code>&&</code>: „და“, <code>||</code>: „ან“, <code>!</code>: „არა“',
            ],
            code: `const label = leaves > 0 ? 'ფოთლიანი' : 'შიშველი';  // ternary

if (isAutumn && leaves > 0) {
  // შემოდგომაა და ფოთლებიც არის
}

5 == '5'   // true  ← ტიპს გარდაქმნის
5 === '5'  // false ← მკაცრი შედარება`,
            tip: '<code>=</code> ანიჭებს, <code>===</code> ადარებს. <code>if (x = 5)</code> ყოველთვის true იქნება, ეს კი ხშირი შეცდომაა.',
        },
        run() {
            const leaves = Math.floor(Math.random() * 16);
            const seasons = ['spring', 'summer', 'autumn', 'winter'];
            const season = seasons[Math.floor(Math.random() * seasons.length)];
            let status, color;

            if (leaves > 10) status = 'ხე ხშირფოთლიანია';
            else if (leaves > 0) status = 'ფოთლები ცოტაა';
            else status = 'ხე შიშველია';

            switch (season) {
                case 'autumn': color = 'yellow'; break;
                case 'winter': color = 'none'; break;
                default: color = 'green';
            }
            return `leaves = ${leaves}, season = '${season}'\n→ status: ${status}\n→ color:  ${color}`;
        },
    },
    {
        id: 'loops',
        title: 'ციკლები',
        en: 'Loops',
        label: 'ციკლი',
        icon: 'repeat',
        summary: 'ციკლი ერთსა და იმავე კოდს რამდენჯერმე იმეორებს და ყოველ ჯერზე პირობას ამოწმებს, გააგრძელოს თუ არა.',
        analogy: 'ციკლი წრეზე სირბილს ჰგავს: „გაირბინე 5 წრე“. ყოველი წრის შემდეგ ითვლი, რამდენი დარჩა, და როცა პირობა აღარ სრულდება, ჩერდები.',
        keyPoints: [
            'for: როცა იცი, რამდენჯერ',
            'while: სანამ პირობა true-ა',
            'for...of: მასივის ყოველ ელემენტზე',
        ],
        bridge: 'ციკლის შიგნით პირობაა (i < leaves), ასე რომ ციკლი წინა თემაზე დგას.',
        code: `// ყველა ფოთოლი ერთ რიგად
let row = '';
for (let i = 0; i < leaves; i++) {
  row += '*';
}

// სანამ ფოთოლი დარჩა, ვაცვენთ
while (leaves > 0) {
  leaves--;
}`,
        more: {
            title: 'for, while და მასივზე გავლა',
            points: [
                '<code>for (start; პირობა; ნაბიჯი)</code>: როცა იცი, რამდენჯერ უნდა გაიმეოროს',
                '<code>while (პირობა)</code>: იმეორებს, სანამ პირობა true-ა',
                '<code>do...while</code>: ერთხელ მაინც შესრულდება',
                '<code>for...of</code>: მასივის ყოველი ელემენტი, ინდექსის გარეშე',
                '<code>for...in</code>: ობიექტის გასაღებები',
                '<code>break</code>: ციკლს წყვეტს, <code>continue</code>: გადადის შემდეგ ბრუნზე',
                '<code>array.forEach(fn)</code>: მასივის მეთოდი, ფუნქციას იღებს',
            ],
            code: `const colors = ['green', 'yellow', 'brown'];

for (const color of colors) {
  if (color === 'yellow') continue; // გამოტოვე
  console.log(color);               // green, brown
}

colors.forEach((c, i) => console.log(i, c));`,
            tip: 'თუ პირობა არასდროს გახდება false (მაგ. დაგავიწყდა <code>i++</code>), ციკლი უსასრულოდ ბრუნავს და გვერდი გაიყინება.',
        },
        run() {
            let leaves = 3 + Math.floor(Math.random() * 6);
            let row = '';
            for (let i = 0; i < leaves; i++) row += '*';
            const lines = [`for:   ${row}  (${leaves} ფოთოლი)`];
            let fallen = '';
            while (leaves > 0) {
                leaves--;
                fallen += '.';
            }
            lines.push(`while: ${fallen}  ყველა ჩამოცვივდა, leaves = ${leaves}`);
            return lines.join('\n');
        },
    },
    {
        id: 'functions',
        title: 'ფუნქციები',
        en: 'Functions',
        label: 'ფუნქცია',
        icon: 'braces',
        summary: 'ფუნქცია არის კოდის სახელიანი ნაჭერი: ერთხელ წერ და რამდენჯერაც გინდა, იმდენჯერ იძახებ. შიგნით ცვლადებს, პირობებს და ციკლებს აერთიანებს.',
        analogy: 'ფუნქცია რეცეპტს ჰგავს: ინგრედიენტები (პარამეტრები) შედის, კერძი (return) გამოდის. ერთხელ წერ და რამდენჯერაც გინდა, იმდენჯერ „ამზადებ“.',
        keyPoints: [
            'პარამეტრები შემავალი მონაცემია',
            'return შედეგს აბრუნებს',
            'return-ის გარეშე ფუნქცია void-ია და undefined-ს აბრუნებს',
        ],
        bridge: 'წინა სამ თემას ერთად ვკრავთ და სახელს ვარქმევთ, მაგალითად growLeaf().',
        code: `// return: აბრუნებს მნიშვნელობას
function growLeaf(count) {
  return count + 1;
}

// void: არაფერს აბრუნებს, მხოლოდ რაღაცას აკეთებს
function shake() {
  console.log('ქარი ქრის');
}

leaves = growLeaf(leaves); // 6
shake();`,
        more: {
            title: 'return vs void და ფუნქციის ფორმები',
            points: [
                '<code>return</code>: შედეგს აბრუნებს. ფუნქცია აქვე ჩერდება',
                '<b>void</b>: return არ აქვს, ამიტომ შედეგი <code>undefined</code>-ია',
                '<code>function name() {}</code>: declaration, გამოცხადებამდეც შეგიძლია გამოიძახო',
                '<code>const f = () => {}</code>: arrow ფუნქცია, მოკლე ჩანაწერი',
                'პარამეტრს შეიძლება ჰქონდეს default: <code>(count = 0)</code>',
                'ფუნქციის შიგნით შექმნილი ცვლადი გარეთ არ ჩანს (scope)',
                'ფუნქცია შეიძლება გადასცე სხვა ფუნქციას (callback)',
            ],
            code: `const double = n => n * 2;          // arrow + ავტომატური return
const result = shake();             // undefined ← void

function grow(count = 0, by = 1) {  // default მნიშვნელობები
  return count + by;
}
grow();      // 1
grow(5, 3);  // 8`,
            tip: '<code>return</code>-ის შემდეგ დაწერილი კოდი არასდროს შესრულდება. ფუნქცია იქვე მთავრდება.',
        },
        run() {
            const growLeaf = (count) => count + 1;
            const shake = () => { /* void */ };
            let leaves = 5;
            const before = leaves;
            leaves = growLeaf(leaves);
            const voidResult = shake();
            return `growLeaf(${before}) → ${leaves}   (return)\nshake()     → ${voidResult}   (void)`;
        },
    },
    {
        id: 'classes',
        title: 'კლასები',
        en: 'Classes',
        label: 'კლასი',
        icon: 'layers',
        summary: 'კლასი არის ნახაზი, რომლითაც ობიექტებს ქმნი. მასში ერთადაა მონაცემები (ცვლადები) და ქცევა (ფუნქციები, ანუ მეთოდები).',
        analogy: 'კლასი სახლის ნახაზია, ობიექტი კი ამ ნახაზით აშენებული კონკრეტული სახლი. ერთი ნახაზით ბევრ სახლს ააშენებ (new) და თითოს თავისი ფერი ექნება (this.color).',
        keyPoints: [
            'class ნახაზია, new ქმნის ობიექტს',
            'constructor საწყის მნიშვნელობებს აყენებს',
            'this კონკრეტულ ობიექტზე მიუთითებს',
        ],
        bridge: 'ცვლადი და ფუნქცია ერთ ობიექტში ერთიანდება: ყოველ ფოთოლს თავისი ფერი და თავისი age() აქვს.',
        code: `class Leaf {
  constructor(color = 'green') {
    this.color = color;
  }

  age() {
    if (this.color === 'green') this.color = 'yellow';
    else if (this.color === 'yellow') this.color = 'dry';
    return this.color;
  }
}

const leaf = new Leaf();
leaf.age(); // 'yellow'`,
        more: {
            title: 'კლასის ნაწილები',
            points: [
                '<code>constructor()</code>: ეშვება <code>new</code>-ის დროს და საწყის მნიშვნელობებს აყენებს',
                '<code>this</code>: მიუთითებს კონკრეტულ ობიექტზე, რომელიც კლასით შეიქმნა',
                'მეთოდი არის ფუნქცია კლასის შიგნით: <code>leaf.age()</code>',
                '<code>new Leaf()</code>: ქმნის ახალ ეგზემპლარს (instance)',
                '<code>extends</code>: მემკვიდრეობა. <code>super()</code> იძახებს მშობლის constructor-ს',
                '<code>static</code>: მეთოდი, რომელიც კლასს ეკუთვნის და არა ობიექტს',
            ],
            code: `class MapleLeaf extends Leaf {
  constructor() {
    super('red');      // მშობლის constructor
    this.shape = 'maple';
  }
}

const m = new MapleLeaf();
m.color;  // 'red'
m.age();  // მეთოდი მემკვიდრეობით მიიღო`,
            tip: '<code>new</code>-ის გარეშე <code>Leaf()</code> შეცდომას ისვრის: კლასის გამოძახება მხოლოდ <code>new</code>-ით შეიძლება.',
        },
        run() {
            class Leaf {
                constructor(color = 'green') { this.color = color; }
                age() {
                    if (this.color === 'green') this.color = 'yellow';
                    else if (this.color === 'yellow') this.color = 'dry';
                    return this.color;
                }
            }
            const leaf = new Leaf();
            const steps = [leaf.color];
            steps.push(leaf.age(), leaf.age());
            return `new Leaf() → ${steps.join('  →  ')}`;
        },
    },
    {
        id: 'dom',
        title: 'DOM',
        en: 'Document Object Model',
        label: 'DOM',
        icon: 'network',
        summary: 'DOM არის HTML გვერდი, წარმოდგენილი ობიექტების ხედ. JS-ით შეგიძლია იპოვო ელემენტი, შეცვალო, შექმნა და მოუსმინო მოვლენებს (click, input…).',
        analogy: 'DOM გვერდის საოჯახო ხეა: <html> წინაპარია, <body> მისი შვილი, ღილაკები და ტექსტები კიდევ უფრო ქვემოთ არიან. JS ამ ხეზე „ადის“, ელემენტს პოულობს და ცვლის.',
        keyPoints: [
            'querySelector ელემენტს პოულობს',
            'createElement + append ახალს ქმნის',
            'addEventListener მოქმედებას (click) უსმენს',
        ],
        bridge: 'ციკლით ვქმნით ელემენტებს, ფუნქციით კი კლიკს ვამუშავებთ. ყველაფერი წინა თემებიდან მოდის.',
        code: `const garden = document.querySelector('#garden');

for (let i = 0; i < 5; i++) {
  const el = document.createElement('span');
  el.textContent = 'ფოთოლი';
  el.classList.add('leaf');
  garden.append(el);
}

garden.addEventListener('click', (e) => {
  e.target.classList.toggle('dry');
});`,
        more: {
            title: 'მთავარი DOM მეთოდები',
            points: [
                '<code>querySelector(\'.x\')</code>: პირველი ელემენტი, რომელიც სელექტორს ემთხვევა',
                '<code>querySelectorAll()</code>: ყველა დამთხვევა (NodeList)',
                '<code>createElement()</code> + <code>append()</code>: ახალი ელემენტის შექმნა და ჩასმა',
                '<code>textContent</code>: მხოლოდ ტექსტი, უსაფრთხოა',
                '<code>innerHTML</code>: HTML-ს კითხულობს. მომხმარებლის ტექსტით სიფრთხილე გმართებს (XSS)',
                '<code>classList.add / remove / toggle</code>: CSS კლასების მართვა',
                '<code>addEventListener(\'click\', fn)</code>: მოვლენაზე რეაქცია',
            ],
            code: `const btn = document.querySelector('.btn');

btn.addEventListener('click', () => {
  document.body.classList.toggle('autumn');
});

const input = document.querySelector('input');
input.addEventListener('input', (e) => {
  console.log(e.target.value);
});`,
            tip: 'სკრიპტს <code>defer</code> დაუმატე (<code>&lt;script src="app.js" defer&gt;</code>), თორემ JS შეიძლება გაეშვას მანამ, სანამ HTML ჩაიტვირთება, და <code>querySelector</code> დააბრუნებს <code>null</code>-ს.',
        },
        run(out) {
            out.textContent = '';
            const garden = document.createElement('div');
            garden.className = 'garden';
            for (let i = 0; i < 5; i++) {
                const el = document.createElement('button');
                el.type = 'button';
                el.innerHTML = icon('leaf');
                el.setAttribute('aria-label', 'ფოთოლი, დააჭირე');
                el.setAttribute('aria-pressed', 'false');
                garden.append(el);
            }
            garden.addEventListener('click', (e) => {
                const leaf = e.target.closest('button');
                if (!leaf) return;
                leaf.classList.toggle('dry');
                leaf.setAttribute('aria-pressed', String(leaf.classList.contains('dry')));
            });
            const note = document.createElement('p');
            note.textContent = 'ეს ელემენტები ახლა შეიქმნა JS-ით. დააკლიკე ფოთლებს და გაყვითლდებიან.';
            out.append(garden, note);
        },
    },
    {
        id: 'bom',
        title: 'BOM',
        en: 'Browser Object Model',
        label: 'BOM',
        icon: 'window',
        summary: 'BOM არის თავად ბრაუზერი: ფანჯრის ზომა, მისამართი, ისტორია, მეხსიერება (localStorage), ტაიმერები. DOM-იც მისი ნაწილია: window.document.',
        analogy: 'თუ DOM ოთახის ავეჯია, BOM მთელი სახლია: ფანჯრები (window), მისამართი (location), კარადა, სადაც ნივთებს ინახავ (localStorage), და მაღვიძარა (setTimeout).',
        keyPoints: [
            'window ყველაფრის მშობელია',
            'localStorage მონაცემს განახლების შემდეგაც ინახავს',
            'setTimeout კოდს დაგვიანებით უშვებს',
        ],
        bridge: 'DOM გვერდის შიგთავსია, BOM კი მის გარშემო მყოფი ბრაუზერი. ბაღის მდგომარეობას localStorage-ში ვინახავთ.',
        code: `// window: ბრაუზერის ფანჯარა
console.log(window.innerWidth);

// localStorage: გვერდის განახლების შემდეგაც რჩება
let visits = Number(localStorage.getItem('visits')) || 0;
localStorage.setItem('visits', visits + 1);

// location, navigator, ტაიმერი
console.log(location.href, navigator.language);
setTimeout(() => console.log('3 წამი გავიდა'), 3000);`,
        more: {
            title: 'window-ის ობიექტები',
            points: [
                '<code>window</code>: გლობალური ობიექტი, ყველაფერი მასშია',
                '<code>innerWidth / innerHeight</code>: ფანჯრის ზომა',
                '<code>location</code>: მისამართი. <code>location.reload()</code> გვერდს განაახლებს',
                '<code>history.back()</code>: უკან დაბრუნება',
                '<code>navigator</code>: ინფორმაცია ბრაუზერზე და ენაზე',
                '<code>localStorage</code>: სტრიქონებს ინახავს სამუდამოდ, <code>sessionStorage</code> კი ტაბის დახურვამდე',
                '<code>setTimeout / setInterval</code>: დაგვიანებით ან განმეორებით გაშვება',
                '<code>alert / confirm / prompt</code>: ბრაუზერის მარტივი ფანჯრები',
            ],
            code: `// ობიექტის შენახვა: localStorage მხოლოდ სტრიქონს იღებს
const garden = { leaves: 5 };
localStorage.setItem('garden', JSON.stringify(garden));

const saved = JSON.parse(localStorage.getItem('garden'));

const id = setInterval(() => console.log('tick'), 1000);
clearInterval(id); // გაჩერება`,
            tip: 'localStorage-ში ყველაფერი სტრიქონად ინახება. ობიექტისთვის <code>JSON.stringify</code> / <code>JSON.parse</code> გამოიყენე.',
        },
        run() {
            let visits = '—';
            try {
                visits = (Number(localStorage.getItem('js-leaves-visits')) || 0) + 1;
                localStorage.setItem('js-leaves-visits', visits);
            } catch {
                visits = 'localStorage მიუწვდომელია';
            }
            return [
                `window.innerWidth  → ${window.innerWidth}px`,
                `window.innerHeight → ${window.innerHeight}px`,
                `navigator.language → ${navigator.language}`,
                `location.protocol  → ${location.protocol}`,
                `localStorage visits → ${visits}  (კიდევ დააჭირე და გაიზრდება)`,
            ].join('\n');
        },
    },
    {
        id: 'api',
        title: 'API',
        en: 'fetch & async',
        label: 'API',
        icon: 'globe',
        summary: 'API გაძლევს საშუალებას, სხვა სერვერიდან წამოიღო ან გააგზავნო მონაცემი. fetch() აბრუნებს Promise-ს, async/await კი ამ კოდს ჩვეულებრივი კოდივით წასაკითხს ხდის.',
        analogy: 'API რესტორნის მიმტანს ჰგავს: შეკვეთას აძლევ (fetch), ის სამზარეულოში (სერვერზე) მიდის და კერძით (JSON) ბრუნდება. სანამ ელოდები, სხვა საქმის კეთება შეგიძლია (async).',
        keyPoints: [
            'fetch სერვერს მოთხოვნას უგზავნის',
            'await პასუხს ელოდება',
            'try/catch შეცდომას იჭერს',
        ],
        bridge: 'ჯაჭვის ბოლო რგოლი: async ფუნქცია, try/catch პირობა, JSON ობიექტად და შედეგი DOM-ში. ყველა თემა ერთად.',
        code: `async function loadTask() {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/todos/1');
    if (!res.ok) throw new Error(res.status);

    const task = await res.json();   // JSON → object
    garden.textContent = task.title; // → DOM
  } catch (err) {
    console.error('ვერ ჩაიტვირთა', err);
  }
}`,
        more: {
            title: 'fetch, Promise და JSON',
            points: [
                '<code>fetch(url)</code>: HTTP მოთხოვნა, აბრუნებს Promise-ს',
                '<code>Promise</code>: მომავალი შედეგი. შეიძლება იყოს pending, fulfilled ან rejected',
                '<code>async / await</code>: დაელოდე Promise-ს ისე, რომ <code>.then()</code> არ დაგჭირდეს',
                '<code>res.ok</code>: true, თუ სტატუსი 200–299-ია',
                '<code>res.json()</code>: პასუხს JS ობიექტად აქცევს',
                '<code>try / catch</code>: ქსელის შეცდომის დაჭერა',
                'მეთოდები: <code>GET</code> (წამოღება), <code>POST</code> (გაგზავნა), <code>PUT</code>, <code>DELETE</code>',
            ],
            code: `// POST: მონაცემის გაგზავნა
await fetch('/api/leaves', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ color: 'yellow' }),
});

// იგივე .then()-ით
fetch(url).then(r => r.json()).then(data => console.log(data));`,
            tip: '<code>fetch</code> 404-ზე ან 500-ზე შეცდომას არ ისვრის. <code>res.ok</code> შენ თვითონ უნდა შეამოწმო.',
        },
        async run() {
            const res = await fetch('https://jsonplaceholder.typicode.com/todos/1');
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const task = await res.json();
            return `status: ${res.status} OK\n${JSON.stringify(task, null, 2)}`;
        },
    },
];
