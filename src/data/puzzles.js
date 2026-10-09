'use strict';

/* =========================================================
   PUZZLES — put the steps in order; the result runs live.

   Each step has a rank. Steps that may swap places share a rank,
   so any order where ranks never go down is accepted.
   explain: the short note on the back of the rolling line.
   ========================================================= */

const PUZZLES = [
    {
        title: 'მასივი ეკრანზე',
        goal: 'ხილის მასივი სიად უნდა გამოჩნდეს ეკრანზე.',
        topics: ['variables', 'loops', 'dom'],
        steps: [
            { rank: 1, code: "const fruits = ['ვაშლი', 'მსხალი', 'ატამი'];", explain: 'ქმნის ხილის მასივს: სამი სახელი ერთ სიაში.' },
            { rank: 1, code: "const list = document.querySelector('#list');", explain: 'პოულობს გვერდზე #list ელემენტს, სადაც სია ჩაჯდება.' },
            { rank: 2, code: 'fruits.forEach((fruit) => {', explain: 'ციკლი: ყოველი ხილისთვის შიგნითა კოდი ერთხელ შესრულდება.' },
            { rank: 3, code: "  const li = document.createElement('li');", explain: 'ქმნის ახალ, ცარიელ <li>-ს. გვერდზე ის ჯერ არ ჩანს.' },
            { rank: 4, code: '  li.textContent = fruit;', explain: 'ჯერ ვავსებთ: <li>-ში იწერება ხილის სახელი.' },
            { rank: 5, code: '  list.append(li);', explain: 'მერე ვსვამთ: მზა <li> სიაში ემატება და ეკრანზე ჩნდება.' },
            { rank: 6, code: '});', explain: 'ხურავს forEach-ის ფუნქციას.' },
        ],
        run(preview) {
            const fruits = ['ვაშლი', 'მსხალი', 'ატამი'];
            const list = document.createElement('ul');
            list.className = 'demo-list';
            preview.append(list);
            fruits.forEach((fruit, i) => {
                const li = document.createElement('li');
                li.textContent = fruit;
                li.style.animationDelay = `${i * 120}ms`;
                list.append(li);
            });
        },
    },
    {
        title: 'ქულების შემოწმება',
        goal: 'დაბეჭდე მხოლოდ ის ქულები, რომლებიც 60-ზე მეტი ან ტოლია.',
        topics: ['variables', 'loops', 'conditions'],
        steps: [
            { rank: 1, code: 'const scores = [45, 82, 67, 91];', explain: 'სტუდენტების ქულები ერთ მასივში.' },
            { rank: 2, code: 'for (const score of scores) {', explain: 'ციკლი: score რიგრიგობით ხდება 45, 82, 67, 91.' },
            { rank: 3, code: '  if (score >= 60) {', explain: 'ამოწმებს: ქულა 60 ან მეტია?' },
            { rank: 4, code: "    console.log(score + ' ჩააბარა');", explain: 'ბეჭდავს ქულას, მხოლოდ თუ პირობა სრულდება.' },
            { rank: 5, code: '  }', explain: 'ხურავს if-ის ბლოკს.' },
            { rank: 6, code: '}', explain: 'ხურავს for ციკლს.' },
        ],
        run(preview) {
            const scores = [45, 82, 67, 91];
            const lines = [];
            for (const score of scores) {
                if (score >= 60) lines.push(`${score} ჩააბარა`);
            }
            preview.append(consoleBox(lines));
        },
    },
    {
        title: 'ფოთლების ფილტრი',
        goal: 'შექმენი ფოთლები კლასით და დაითვალე ყვითლები.',
        topics: ['classes', 'functions', 'variables'],
        steps: [
            { rank: 1, code: 'class Leaf {\n  constructor(color) { this.color = color; }\n}', explain: 'კლასი: ფოთლის „ნახაზი“. ყოველ ფოთოლს თავისი ფერი აქვს.' },
            { rank: 1, code: "const colors = ['green', 'yellow', 'green', 'yellow'];", explain: 'ოთხი ფერი, რომლებითაც ფოთლებს შევქმნით.' },
            { rank: 2, code: 'const leaves = colors.map((c) => new Leaf(c));', explain: 'map ყოველი ფერიდან ახალ Leaf ობიექტს ქმნის.' },
            { rank: 3, code: "const yellow = leaves.filter((l) => l.color === 'yellow');", explain: 'filter ტოვებს მხოლოდ ყვითელ ფოთლებს.' },
            { rank: 4, code: 'console.log(yellow.length); // 2', explain: 'ბეჭდავს, რამდენი ყვითელი ფოთოლი დარჩა.' },
        ],
        run(preview) {
            class Leaf { constructor(color) { this.color = color; } }
            const leaves = ['green', 'yellow', 'green', 'yellow'].map(c => new Leaf(c));
            const yellow = leaves.filter(l => l.color === 'yellow');
            const row = document.createElement('div');
            row.className = 'demo-leaves';
            row.innerHTML = leaves.map(l => `<span class="demo-leaf ${l.color === 'yellow' ? 'dry' : ''}">${icon('leaf')}</span>`).join('');
            preview.append(row, consoleBox([`yellow.length = ${yellow.length}`]));
        },
    },
    {
        title: 'მთვლელი ღილაკი',
        goal: 'ღილაკი ითვლის დაჭერებს და რიცხვი გვერდის განახლების შემდეგაც რჩება.',
        topics: ['dom', 'bom', 'functions'],
        steps: [
            { rank: 1, code: "const btn = document.querySelector('#counter');", explain: 'პოულობს ღილაკს გვერდზე.' },
            { rank: 1, code: "let count = Number(localStorage.getItem('count')) || 0;", explain: 'კითხულობს შენახულ რიცხვს; თუ ჯერ არაფერია, იწყებს 0-დან.' },
            { rank: 2, code: 'btn.textContent = count;', explain: 'ღილაკზე აჩვენებს საწყის რიცხვს.' },
            { rank: 3, code: "btn.addEventListener('click', () => {", explain: 'ყოველ დაჭერაზე შიგნითა ფუნქცია გაეშვება.' },
            { rank: 4, code: '  count++;', explain: 'ზრდის მთვლელს 1-ით.' },
            { rank: 5, code: "  localStorage.setItem('count', count);", explain: 'ინახავს რიცხვს ბრაუზერში: განახლების შემდეგაც დარჩება.' },
            { rank: 5, code: '  btn.textContent = count;', explain: 'ღილაკზე აჩვენებს ახალ რიცხვს.' },
            { rank: 6, code: '});', explain: 'ხურავს click-ის ფუნქციას.' },
        ],
        run(preview) {
            const KEY = 'js-leaves-counter';
            const read = () => { try { return Number(localStorage.getItem(KEY)) || 0; } catch { return 0; } };
            let count = read();
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'btn btn--primary demo-counter';
            btn.textContent = count;
            btn.addEventListener('click', () => {
                count++;
                try { localStorage.setItem(KEY, count); } catch { /* ignore */ }
                btn.textContent = count;
            });
            const note = document.createElement('p');
            note.className = 'demo-note';
            note.textContent = 'დააჭირე ღილაკს, მერე გვერდი განაახლე: რიცხვი დარჩება.';
            preview.append(btn, note);
        },
    },
    {
        title: 'API-დან სახელები',
        goal: 'სერვერიდან წამოიღე მომხმარებლები და მათი სახელები აჩვენე.',
        topics: ['api', 'functions', 'dom'],
        steps: [
            { rank: 1, code: 'async function showUsers() {', explain: 'async ფუნქცია: მის შიგნით await-ით ლოდინი შეგვიძლია.' },
            { rank: 2, code: "  const res = await fetch('https://jsonplaceholder.typicode.com/users');", explain: 'აგზავნის მოთხოვნას სერვერზე და ელოდება პასუხს.' },
            { rank: 3, code: '  const users = await res.json();', explain: 'პასუხს JSON ტექსტიდან JS მასივად აქცევს.' },
            { rank: 4, code: '  const names = users.map((u) => u.name);', explain: 'ყოველი მომხმარებლიდან მხოლოდ სახელს იღებს.' },
            { rank: 5, code: "  output.textContent = names.join(', ');", explain: 'სახელებს მძიმით აერთებს და ეკრანზე წერს.' },
            { rank: 6, code: '}', explain: 'ხურავს ფუნქციას.' },
            { rank: 7, code: 'showUsers();', explain: 'იძახებს ფუნქციას: მხოლოდ ახლა იწყება ყველაფერი.' },
        ],
        async run(preview) {
            const box = consoleBox(['იტვირთება...']);
            preview.append(box);
            try {
                const res = await fetch('https://jsonplaceholder.typicode.com/users');
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const users = await res.json();
                box.textContent = users.slice(0, 5).map(u => u.name).join(', ') + ' …';
            } catch (err) {
                box.textContent = `ვერ ჩაიტვირთა (${err.message}). შეამოწმე ინტერნეტი.`;
                box.classList.add('is-error');
            }
        },
    },

    /* ---------- real-life examples ---------- */
    {
        title: 'ფასდაკლება',
        goal: 'მაღაზიაში ფასდაკლებაა. დაწერე ფუნქცია, რომელიც ფასს და პროცენტს იღებს და საბოლოო ფასს აბრუნებს.',
        topics: ['functions', 'variables'],
        steps: [
            { rank: 1, code: 'function discount(price, percent) {', explain: 'ქმნის ფუნქციას ორი პარამეტრით: ფასი და პროცენტი.' },
            { rank: 2, code: '  const cut = price * percent / 100;', explain: 'ითვლის, რამდენი ლარი აკლდება: 120-ის 25% = 30.' },
            { rank: 3, code: '  return price - cut;', explain: 'აბრუნებს ფასს ფასდაკლების გამოკლებით.' },
            { rank: 4, code: '}', explain: 'ხურავს ფუნქციას. ჯერ არაფერი შესრულებულა, ის მხოლოდ აღწერილია.' },
            { rank: 5, code: 'const jacket = discount(120, 25);', explain: 'იძახებს ფუნქციას: 120 ლარის ქურთუკი, 25% ფასდაკლება.' },
            { rank: 6, code: 'console.log(jacket); // 90', explain: 'ბეჭდავს საბოლოო ფასს: 90.' },
        ],
        run(preview) {
            function discount(price, percent) {
                const cut = price * percent / 100;
                return price - cut;
            }
            const items = [
                { name: 'ქურთუკი', price: 120, percent: 25 },
                { name: 'კედები', price: 80, percent: 10 },
                { name: 'ქუდი', price: 30, percent: 50 },
            ];
            preview.append(
                demoEl('div', 'demo-shelf', items.map((it, i) => `
                    <div class="price-tag" style="animation-delay: ${i * 120}ms">
                        <span class="price-tag__badge">−${it.percent}%</span>
                        <b class="price-tag__name">${it.name}</b>
                        <span class="price-tag__old">${it.price} ₾</span>
                        <span class="price-tag__new">${discount(it.price, it.percent)} ₾</span>
                    </div>`).join('')),
                consoleBox([`discount(120, 25) → ${discount(120, 25)}`]),
            );
        },
    },
    {
        title: 'ბიუჯეტის ფილტრი',
        goal: 'ჯიბეში 5 ლარი გაქვს. აარჩიე მხოლოდ ის პროდუქტები, რომლებიც მარაგშია და ბიუჯეტში ეტევა.',
        topics: ['functions', 'conditions', 'variables'],
        steps: [
            { rank: 1, code: 'const budget = 5;', explain: 'რამდენი ფული გვაქვს.' },
            {
                rank: 1,
                code: "const products = [\n  { name: 'პური', price: 1.2, inStock: true },\n  { name: 'ყველი', price: 14, inStock: true },\n  { name: 'რძე', price: 3.5, inStock: false },\n  { name: 'ვაშლი', price: 2.8, inStock: true },\n];",
                explain: 'მაღაზიის თარო: ყოველ პროდუქტს ფასი და მარაგი აქვს.',
            },
            { rank: 2, code: 'const cheap = products.filter((p) => {', explain: 'filter ყველა პროდუქტს გადის და ტოვებს მხოლოდ იმას, სადაც true დაბრუნდება.' },
            { rank: 3, code: '  return p.inStock && p.price <= budget;', explain: 'ორივე პირობა ერთად (&&): მარაგშია და ბიუჯეტში ეტევა.' },
            { rank: 4, code: '});', explain: 'ხურავს filter-ის ფუნქციას.' },
            { rank: 5, code: "console.log(cheap.map((p) => p.name)); // ['პური', 'ვაშლი']", explain: 'ბეჭდავს შერჩეული პროდუქტების სახელებს.' },
        ],
        run(preview) {
            const budget = 5;
            const products = [
                { name: 'პური', price: 1.2, inStock: true },
                { name: 'ყველი', price: 14, inStock: true },
                { name: 'რძე', price: 3.5, inStock: false },
                { name: 'ვაშლი', price: 2.8, inStock: true },
            ];
            const cheap = products.filter((p) => p.inStock && p.price <= budget);
            preview.append(
                demoEl('div', 'demo-products', products.map((p, i) => {
                    const ok = cheap.includes(p);
                    const why = ok ? 'ბიუჯეტში ეტევა' : p.inStock ? 'ძვირია' : 'არ არის მარაგში';
                    return `
                        <div class="product ${ok ? 'is-in' : 'is-out'}" style="animation-delay: ${i * 120}ms">
                            <b>${p.name}</b>
                            <span>${p.price} ₾</span>
                            <small>${icon(ok ? 'check' : 'x')}${why}</small>
                        </div>`;
                }).join('')),
                consoleBox([`['${cheap.map(p => p.name).join("', '")}']`]),
            );
        },
    },
    {
        title: 'ლიდერბორდი',
        goal: 'თამაშის ცხრილი: დაალაგე მოთამაშეები ქულით, დიდიდან პატარისკენ, და დაბეჭდე პირველი სამი.',
        topics: ['functions', 'loops', 'variables'],
        steps: [
            {
                rank: 1,
                code: "const players = [\n  { name: 'ნიკა', score: 340 },\n  { name: 'მარიამი', score: 520 },\n  { name: 'გიორგი', score: 410 },\n  { name: 'ელენე', score: 280 },\n];",
                explain: 'მოთამაშეები და მათი ქულები, ჯერ არეული რიგით.',
            },
            { rank: 2, code: 'players.sort((a, b) => b.score - a.score);', explain: 'sort ალაგებს: b − a ნიშნავს, რომ დიდი ქულა წინ მოდის.' },
            { rank: 3, code: 'const top3 = players.slice(0, 3);', explain: 'slice იღებს პირველ სამს (ინდექსები 0, 1, 2).' },
            { rank: 4, code: 'top3.forEach((p, i) => {', explain: 'გადის სამეულზე; i არის ადგილი, 0-დან.' },
            { rank: 5, code: '  console.log(`${i + 1}. ${p.name}: ${p.score}`);', explain: 'ბეჭდავს ადგილს, სახელს და ქულას.' },
            { rank: 6, code: '});', explain: 'ხურავს ციკლს.' },
        ],
        run(preview) {
            const players = [
                { name: 'ნიკა', score: 340 },
                { name: 'მარიამი', score: 520 },
                { name: 'გიორგი', score: 410 },
                { name: 'ელენე', score: 280 },
            ];
            players.sort((a, b) => b.score - a.score);
            const top3 = players.slice(0, 3);
            preview.append(
                demoEl('ol', 'demo-board', players.map((p, i) => `
                    <li class="${i < 3 ? '' : 'is-out'}" style="--w: ${p.score / players[0].score}; animation-delay: ${i * 120}ms">
                        <span class="demo-board__place">${i + 1}</span>
                        <span>${p.name}</span>
                        <span class="demo-board__bar"></span>
                        <b>${p.score}</b>
                    </li>`).join('')),
                consoleBox(top3.map((p, i) => `${i + 1}. ${p.name}: ${p.score}`)),
            );
        },
    },
    {
        title: 'Bubble sort: რიგი სიმაღლით',
        goal: 'ფიზკულტურაზე მოსწავლეები სიმაღლით უნდა დადგნენ. Bubble sort მეზობლებს ადარებს და, თუ მარცხენა უფრო მაღალია, ადგილს უცვლის.',
        topics: ['loops', 'conditions', 'variables'],
        steps: [
            { rank: 1, code: 'const heights = [165, 150, 180, 158, 172];', explain: 'მოსწავლეების სიმაღლეები, ჯერ არეულად დგანან.' },
            { rank: 2, code: 'for (let i = 0; i < heights.length - 1; i++) {', explain: 'გარე ციკლი: ყოველ გავლაზე ყველაზე მაღალი ბოლოში „ამოტივტივდება“.' },
            { rank: 3, code: '  for (let j = 0; j < heights.length - 1 - i; j++) {', explain: 'შიდა ციკლი: მეზობელ წყვილებს გადის; ბოლოში უკვე დალაგებულებს აღარ ეხება.' },
            { rank: 4, code: '    if (heights[j] > heights[j + 1]) {', explain: 'ადარებს მეზობლებს: მარცხენა უფრო მაღალია?' },
            { rank: 5, code: '      [heights[j], heights[j + 1]] = [heights[j + 1], heights[j]];', explain: 'თუ კი, ორივეს ადგილს უცვლის.' },
            { rank: 6, code: '    }', explain: 'ხურავს if-ს.' },
            { rank: 7, code: '  }', explain: 'ხურავს შიდა ციკლს.' },
            { rank: 8, code: '}', explain: 'ხურავს გარე ციკლს.' },
            { rank: 9, code: 'console.log(heights); // [150, 158, 165, 172, 180]', explain: 'ბეჭდავს დალაგებულ რიგს.' },
        ],
        async run(preview) {
            const heights = [165, 150, 180, 158, 172];
            const stage = demoEl('div', 'demo-bubble');
            const bars = heights.map((h) => {
                const bar = demoEl('span', 'demo-bubble__bar', `<b>${h}</b>`);
                bar.style.setProperty('--h', (h - 110) / 70);
                return bar;
            });
            const place = () => bars.forEach((bar, i) => bar.style.setProperty('--i', i));
            place();
            stage.append(...bars);
            const log = consoleBox(['ვიწყებთ...']);
            preview.append(stage, log);

            const n = heights.length;
            let swaps = 0;
            for (let i = 0; i < n - 1; i++) {
                for (let j = 0; j < n - 1 - i; j++) {
                    const pair = [bars[j], bars[j + 1]];
                    const swap = heights[j] > heights[j + 1];
                    pair.forEach(b => b.classList.add('is-compare'));
                    log.textContent = `${heights[j]} > ${heights[j + 1]} ? ${swap ? 'კი → ადგილს ვუცვლით' : 'არა → ვტოვებთ'}`;
                    await demoWait(650);
                    if (!stage.isConnected) return;     // the preview was cleared
                    if (swap) {
                        [heights[j], heights[j + 1]] = [heights[j + 1], heights[j]];
                        [bars[j], bars[j + 1]] = [bars[j + 1], bars[j]];
                        place();
                        swaps++;
                        await demoWait(450);
                        if (!stage.isConnected) return;
                    }
                    pair.forEach(b => b.classList.remove('is-compare'));
                }
                bars[n - 1 - i].classList.add('is-sorted');
            }
            bars[0].classList.add('is-sorted');
            log.textContent = `[${heights.join(', ')}]  // ${swaps} გაცვლა`;
        },
    },
    {
        title: 'კალათის ჯამი',
        goal: 'ონლაინ მაღაზიის კალათა: დაითვალე, რა ჯდება ყველაფერი ერთად. reduce მასივს ერთ რიცხვად „კრებს“.',
        topics: ['functions', 'variables'],
        steps: [
            {
                rank: 1,
                code: "const cart = [\n  { name: 'წიგნი', price: 18, qty: 2 },\n  { name: 'კალამი', price: 1.5, qty: 4 },\n  { name: 'რვეული', price: 3, qty: 3 },\n];",
                explain: 'კალათა: ყოველ ნივთს ფასი და რაოდენობა აქვს.',
            },
            { rank: 2, code: 'const total = cart.reduce((sum, item) => {', explain: 'reduce ნივთებს სათითაოდ გადის; sum აქამდე დაგროვილი ჯამია.' },
            { rank: 3, code: '  return sum + item.price * item.qty;', explain: 'ჯამს უმატებს ამ ნივთის ფასს, გამრავლებულს რაოდენობაზე.' },
            { rank: 4, code: '}, 0);', explain: 'ხურავს ფუნქციას; 0 არის საწყისი ჯამი.' },
            { rank: 5, code: "console.log(total.toFixed(2) + ' ₾'); // 51.00 ₾", explain: 'ბეჭდავს ჯამს ორი ათწილადით.' },
        ],
        run(preview) {
            const cart = [
                { name: 'წიგნი', price: 18, qty: 2 },
                { name: 'კალამი', price: 1.5, qty: 4 },
                { name: 'რვეული', price: 3, qty: 3 },
            ];
            const rows = [];
            const total = cart.reduce((sum, item) => {
                const after = sum + item.price * item.qty;
                rows.push(`
                    <tr style="animation-delay: ${rows.length * 160}ms">
                        <td>${item.name}</td>
                        <td>${item.qty} × ${item.price}</td>
                        <td>${sum} + ${item.price * item.qty} = <b>${after}</b></td>
                    </tr>`);
                return after;
            }, 0);
            preview.append(demoEl('table', 'demo-receipt', `
                <thead><tr><th>ნივთი</th><th>რაოდ. × ფასი</th><th>sum</th></tr></thead>
                <tbody>${rows.join('')}</tbody>
                <tfoot><tr><td colspan="2">სულ</td><td>${total.toFixed(2)} ₾</td></tr></tfoot>`));
        },
    },
    {
        title: 'ხმების დათვლა',
        goal: 'კლასი კაპიტანს ირჩევს. დაითვალე, ვინ რამდენი ხმა მიიღო.',
        topics: ['loops', 'variables', 'conditions'],
        steps: [
            { rank: 1, code: "const votes = ['ანა', 'ლუკა', 'ანა', 'მაკა', 'ანა', 'ლუკა'];", explain: 'ყოველი ელემენტი ერთი ბიულეტენია.' },
            { rank: 1, code: 'const count = {};', explain: 'ცარიელი ობიექტი: აქ ჩაიწერება სახელი და მისი ხმები.' },
            { rank: 2, code: 'for (const name of votes) {', explain: 'გადის ყოველ ბიულეტენზე.' },
            { rank: 3, code: '  count[name] = (count[name] || 0) + 1;', explain: 'თუ სახელი ჯერ არ არის, || 0 ნულიდან იწყებს; მერე 1-ს უმატებს.' },
            { rank: 4, code: '}', explain: 'ხურავს ციკლს.' },
            { rank: 5, code: 'console.log(count); // { ანა: 3, ლუკა: 2, მაკა: 1 }', explain: 'ბეჭდავს შედეგს: ანამ გაიმარჯვა.' },
        ],
        async run(preview) {
            const votes = ['ანა', 'ლუკა', 'ანა', 'მაკა', 'ანა', 'ლუკა'];
            const names = [...new Set(votes)];
            const most = Math.max(...names.map(n => votes.filter(v => v === n).length));
            const count = {};
            const ballots = demoEl('div', 'demo-ballots', votes.map(v => `<span class="ballot">${v}</span>`).join(''));
            const chart = demoEl('div', 'demo-votes', names.map(n => `
                <div class="vote-row" data-name="${n}">
                    <span>${n}</span><span class="vote-row__bar"></span><b>0</b>
                </div>`).join(''));
            preview.append(ballots, chart);

            for (const [i, name] of votes.entries()) {
                await demoWait(450);
                if (!chart.isConnected) return;
                count[name] = (count[name] || 0) + 1;
                ballots.children[i].classList.add('is-counted');
                const row = chart.querySelector(`[data-name="${name}"]`);
                row.style.setProperty('--n', count[name] / most);
                row.querySelector('b').textContent = count[name];
            }
            const winner = names.reduce((a, b) => (count[a] >= count[b] ? a : b));
            chart.querySelector(`[data-name="${winner}"]`).classList.add('is-winner');
            preview.append(consoleBox([`{ ${names.map(n => `${n}: ${count[n]}`).join(', ')} }`]));
        },
    },
    {
        title: 'პაროლის შემოწმება',
        goal: 'რეგისტრაციის ფორმა: პაროლი უნდა იყოს მინიმუმ 8 სიმბოლო და ერთი ციფრი მაინც ჰქონდეს.',
        topics: ['functions', 'conditions'],
        steps: [
            { rank: 1, code: 'function checkPassword(pw) {', explain: 'ფუნქცია იღებს პაროლს და აბრუნებს შეფასებას.' },
            { rank: 2, code: "  if (pw.length < 8) return 'ძალიან მოკლეა';", explain: 'თუ 8 სიმბოლოზე ნაკლებია, return ფუნქციას აქვე აჩერებს.' },
            { rank: 2, code: "  if (!/[0-9]/.test(pw)) return 'დაამატე ციფრი';", explain: '/[0-9]/ ციფრს ეძებს; თუ ვერ იპოვა, ფუნქცია აქვე ჩერდება.' },
            { rank: 3, code: "  return 'ძლიერია';", explain: 'ორივე შემოწმება გაიარა: პაროლი კარგია.' },
            { rank: 4, code: '}', explain: 'ხურავს ფუნქციას.' },
            { rank: 5, code: "console.log(checkPassword('tbilisi2024')); // ძლიერია", explain: 'ამოწმებს მაგალითს: 11 სიმბოლო და ციფრებიც აქვს.' },
        ],
        run(preview) {
            function checkPassword(pw) {
                if (pw.length < 8) return 'ძალიან მოკლეა';
                if (!/[0-9]/.test(pw)) return 'დაამატე ციფრი';
                return 'ძლიერია';
            }
            const field = demoEl('label', 'demo-field', `
                <span class="demo-field__label">${icon('lock')}სცადე შენი პაროლი</span>
                <input class="demo-input" type="text" value="tbilisi2024" autocomplete="off" spellcheck="false">
                <output class="demo-field__out"></output>`);
            const input = field.querySelector('input');
            const result = field.querySelector('output');
            const show = () => {
                const verdict = checkPassword(input.value);
                result.textContent = `checkPassword('${input.value}') → '${verdict}'`;
                result.dataset.level = verdict === 'ძლიერია' ? 'ok' : verdict === 'დაამატე ციფრი' ? 'mid' : 'bad';
            };
            input.addEventListener('input', show);
            show();
            preview.append(field);
        },
    },
    {
        title: 'კონტაქტების ძებნა',
        goal: 'ტელეფონის კონტაქტები: აკრეფისას სიაში მხოლოდ შესაბამისი სახელები უნდა დარჩეს.',
        topics: ['dom', 'functions', 'loops'],
        steps: [
            { rank: 1, code: "const input = document.querySelector('#search');", explain: 'პოულობს საძიებო ველს.' },
            { rank: 1, code: "const contacts = document.querySelectorAll('#contacts li');", explain: 'პოულობს სიის ყველა კონტაქტს.' },
            { rank: 2, code: "input.addEventListener('input', () => {", explain: 'ყოველ აკრეფილ ასოზე ფუნქცია თავიდან ეშვება.' },
            { rank: 3, code: '  const query = input.value.toLowerCase();', explain: 'იღებს აკრეფილ ტექსტს, პატარა ასოებით.' },
            { rank: 4, code: '  contacts.forEach((li) => {', explain: 'გადის ყოველ კონტაქტზე.' },
            { rank: 5, code: '    li.hidden = !li.textContent.toLowerCase().includes(query);', explain: 'მალავს კონტაქტს, თუ მისი სახელი ამ ტექსტს არ შეიცავს.' },
            { rank: 6, code: '  });', explain: 'ხურავს forEach-ს.' },
            { rank: 7, code: '});', explain: 'ხურავს event listener-ის ფუნქციას.' },
        ],
        run(preview) {
            const names = ['ანა ბერიძე', 'ბექა ლომიძე', 'გიორგი კაპანაძე', 'ელენე ანანიძე', 'ლუკა გელაშვილი', 'ნინო ბერიძე'];
            const box = demoEl('div', 'demo-field', `
                <label class="demo-field">
                    <span class="demo-field__label">${icon('search')}ძებნა</span>
                    <input class="demo-input" type="search" placeholder="მაგ.: ბერიძე" autocomplete="off">
                </label>
                <ul class="demo-contacts">${names.map(n => `<li>${n}</li>`).join('')}</ul>
                <p class="demo-note" aria-live="polite">აკრიფე სახელი ან გვარი.</p>`);
            const input = box.querySelector('input');
            const contacts = box.querySelectorAll('li');
            const note = box.querySelector('.demo-note');
            input.addEventListener('input', () => {
                const query = input.value.toLowerCase();
                contacts.forEach((li) => {
                    li.hidden = !li.textContent.toLowerCase().includes(query);
                });
                const shown = [...contacts].filter(li => !li.hidden).length;
                note.textContent = `ჩანს ${shown} / ${contacts.length}`;
            });
            preview.append(box);
        },
    },
    {
        title: 'რაკეტის გაშვება',
        goal: 'უკუთვლა: ყოველ წამში დაბეჭდე რიცხვი 5-დან 0-მდე, მერე გააჩერე ტაიმერი და გაუშვი რაკეტა.',
        topics: ['bom', 'functions', 'conditions'],
        steps: [
            { rank: 1, code: 'let seconds = 5;', explain: 'საიდან ვიწყებთ თვლას. let, რადგან მნიშვნელობა შეიცვლება.' },
            { rank: 2, code: 'const timer = setInterval(() => {', explain: 'setInterval ფუნქციას ყოველ წამში იმეორებს; timer მისი ნომერია.' },
            { rank: 3, code: '  console.log(seconds);', explain: 'ბეჭდავს, რამდენი წამი დარჩა.' },
            { rank: 4, code: '  seconds--;', explain: 'ამცირებს 1-ით.' },
            { rank: 5, code: '  if (seconds < 0) {', explain: 'ნულიც დაიბეჭდა? დროა გაჩერდეს.' },
            { rank: 6, code: '    clearInterval(timer);', explain: 'აჩერებს ინტერვალს: ფუნქცია აღარ განმეორდება.' },
            { rank: 6, code: "    console.log('გაფრინდა!');", explain: 'ბოლო შეტყობინება.' },
            { rank: 7, code: '  }', explain: 'ხურავს if-ს.' },
            { rank: 8, code: '}, 1000);', explain: 'ხურავს ფუნქციას; 1000 მილიწამი = 1 წამი.' },
        ],
        run(preview) {
            const stage = demoEl('div', 'demo-launch', `
                <span class="demo-launch__count">5</span>
                <span class="demo-launch__rocket">${icon('rocket')}</span>`);
            const display = stage.querySelector('.demo-launch__count');
            const log = consoleBox(['// პირველი გამოძახება 1 წამში']);
            preview.append(stage, log);

            const lines = [];
            let seconds = 5;
            const timer = setInterval(() => {
                if (!stage.isConnected) return clearInterval(timer);
                lines.push(seconds);
                display.textContent = seconds;
                if (!prefersReducedMotion.matches) display.animate([{ transform: 'scale(1.3)' }, { transform: 'none' }], 300);
                seconds--;
                if (seconds < 0) {
                    clearInterval(timer);
                    lines.push('გაფრინდა!');
                    stage.classList.add('is-launched');
                }
                log.textContent = lines.join('\n');
            }, 1000);
        },
    },
    {
        title: 'საბანკო ანგარიში',
        goal: 'საფულის აპი: კლასით შექმენი ანგარიში, შეიტანე 100 ლარი და გაიტანე 30.',
        topics: ['classes', 'functions', 'conditions'],
        steps: [
            { rank: 1, code: 'class Account {', explain: 'აღწერს ანგარიშის „ნახაზს“.' },
            { rank: 2, code: '  constructor(owner) {', explain: 'ეშვება new-ის დროს და ავსებს ახალ ობიექტს.' },
            { rank: 3, code: '    this.owner = owner;', explain: 'ინახავს მფლობელის სახელს.' },
            { rank: 3, code: '    this.balance = 0;', explain: 'ახალ ანგარიშზე თავიდან 0 ლარია.' },
            { rank: 4, code: '  }', explain: 'ხურავს constructor-ს.' },
            { rank: 5, code: '  deposit(amount) { this.balance += amount; }', explain: 'მეთოდი: ბალანსს თანხას უმატებს.' },
            { rank: 5, code: '  withdraw(amount) { if (amount <= this.balance) this.balance -= amount; }', explain: 'მეთოდი: თანხას აკლებს, მხოლოდ თუ ბალანსი საკმარისია.' },
            { rank: 6, code: '}', explain: 'ხურავს კლასს.' },
            { rank: 7, code: "const wallet = new Account('ნინო');", explain: 'ქმნის ნინოს ანგარიშს.' },
            { rank: 8, code: 'wallet.deposit(100);', explain: 'შეაქვს 100 ლარი.' },
            { rank: 9, code: 'wallet.withdraw(30);', explain: 'გააქვს 30 ლარი: ბალანსი საკმარისია.' },
            { rank: 10, code: 'console.log(wallet.balance); // 70', explain: 'ბეჭდავს ნაშთს: 70.' },
        ],
        run(preview) {
            class Account {
                constructor(owner) {
                    this.owner = owner;
                    this.balance = 0;
                }
                deposit(amount) { this.balance += amount; }
                withdraw(amount) { if (amount <= this.balance) this.balance -= amount; }
            }
            const wallet = new Account('ნინო');
            const card = demoEl('div', 'demo-wallet', `
                <p class="demo-wallet__head">${icon('wallet')}${wallet.owner}</p>
                <p class="demo-wallet__balance"><span>0</span> ₾</p>
                <div class="demo-wallet__actions">
                    <button class="btn" type="button" data-amount="20">+20 ₾</button>
                    <button class="btn" type="button" data-amount="-50">−50 ₾</button>
                </div>
                <ul class="demo-wallet__log"></ul>`);
            const balance = card.querySelector('.demo-wallet__balance span');
            const log = card.querySelector('.demo-wallet__log');
            const apply = (amount) => {
                const before = wallet.balance;
                if (amount > 0) wallet.deposit(amount);
                else wallet.withdraw(-amount);
                const ok = wallet.balance !== before;
                const call = amount > 0 ? `deposit(${amount})` : `withdraw(${-amount})`;
                balance.textContent = wallet.balance;
                log.insertAdjacentHTML('afterbegin',
                    `<li class="${ok ? '' : 'is-denied'}">${call} → ${ok ? `ბალანსი ${wallet.balance} ₾` : 'უარყოფილია: თანხა არ კმარა'}</li>`);
            };
            card.addEventListener('click', (e) => {
                const btn = e.target.closest('[data-amount]');
                if (btn) apply(Number(btn.dataset.amount));
            });
            preview.append(card);
            apply(100);
            apply(-30);
        },
    },
];

/** Small DOM helpers for the demos. */
function demoEl(tag, className, html = '') {
    const el = document.createElement(tag);
    el.className = className;
    el.innerHTML = html;
    return el;
}

const demoWait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
