import type { Language } from '@/store/types';

export const SPEECH_PARAGRAPHS: Record<Language, string[]> = {
  en: [
    'The morning sun cast a soft glow across the quiet meadow. Birds sang from the tall oak trees while a gentle breeze carried the scent of wildflowers through the valley. A small stream wound its way past mossy stones, its water clear and cool. The peaceful scene felt like something out of a forgotten storybook.',
    'When sunlight strikes raindrops in the air, the light bends and forms a rainbow. Each color appears in a wide arc across the sky, beginning with red on the outside and ending with violet on the inside. People have studied this beautiful phenomenon for centuries, searching for the science behind its arc.',
    'The harbor town came alive each morning before sunrise. Fishermen prepared their boats while shopkeepers swept the cobblestone streets. The smell of fresh bread drifted from the bakery on the corner, mingling with the salty sea air. By the time the sun climbed above the lighthouse, the day was already in full motion.',
    'A small library sat at the end of a winding country road. Inside, tall wooden shelves held thousands of books arranged by subject and author. Sunlight poured through stained-glass windows, painting colorful patterns on the worn carpet. Visitors often lost track of time, captivated by the quiet magic of every story they discovered.',
    'Autumn brought a riot of colors to the rolling hillsides. Maple trees blazed in shades of crimson and gold while aspens shimmered like coins in the breeze. Children laughed and crunched through fallen leaves on their walk home from school. The crisp air carried the promise of cooler evenings and warm meals shared by the fire.',
  ],
  es: [
    'El sol de la mañana iluminaba suavemente la pradera tranquila. Los pájaros cantaban entre los grandes robles mientras una brisa ligera traía el aroma de las flores silvestres a través del valle. Un pequeño arroyo serpenteaba entre piedras cubiertas de musgo, con agua clara y fresca. La escena parecía sacada de un cuento olvidado.',
    'Cuando la luz del sol atraviesa las gotas de lluvia en el aire, se forma un arcoíris. Cada color aparece en un amplio arco a través del cielo, comenzando con el rojo en el exterior y terminando con el violeta en el interior. La gente ha estudiado este hermoso fenómeno durante siglos.',
    'El pueblo del puerto cobraba vida cada mañana antes del amanecer. Los pescadores preparaban sus barcos mientras los comerciantes barrían las calles empedradas. El aroma del pan recién horneado se mezclaba con el aire salado del mar. Cuando el sol salía sobre el faro, el día ya estaba en pleno movimiento.',
    'Una pequeña biblioteca se encontraba al final de un camino rural sinuoso. Dentro, altos estantes de madera contenían miles de libros ordenados por tema y autor. La luz del sol entraba por vidrieras de colores, pintando patrones brillantes sobre la alfombra desgastada.',
  ],
  fr: [
    "Le soleil du matin baignait la prairie tranquille d'une douce lumière. Les oiseaux chantaient depuis les grands chênes tandis qu'une brise légère portait le parfum des fleurs sauvages à travers la vallée. Un petit ruisseau serpentait entre les pierres moussues, son eau claire et fraîche.",
    "Quand la lumière du soleil frappe les gouttes de pluie dans l'air, elle se courbe et forme un arc-en-ciel. Chaque couleur apparaît en un large arc dans le ciel, commençant par le rouge à l'extérieur et finissant par le violet à l'intérieur. Les gens étudient ce beau phénomène depuis des siècles.",
    "Le village portuaire s'éveillait chaque matin avant le lever du soleil. Les pêcheurs préparaient leurs bateaux tandis que les commerçants balayaient les rues pavées. L'odeur du pain frais se mêlait à l'air salé de la mer.",
    "Une petite bibliothèque se trouvait au bout d'un chemin de campagne sinueux. À l'intérieur, de hautes étagères en bois contenaient des milliers de livres rangés par sujet et par auteur. La lumière du soleil entrait par des vitraux colorés.",
  ],
  zh: [
    '清晨的阳光柔和地洒在宁静的草地上。鸟儿在高大的橡树上歌唱，微风带着野花的清香穿过山谷。一条小溪在长满青苔的石头间蜿蜒流过，溪水清澈而凉爽。这宁静的景象仿佛来自一本被人遗忘的故事书。',
    '当阳光照射到空气中的雨滴时，光线会弯曲并形成彩虹。每种颜色都在天空中形成宽阔的弧线，从外侧的红色开始，到内侧的紫色结束。人们研究这一美丽现象已有数百年的历史。',
    '港口小镇每天日出前就开始热闹起来。渔民们准备着他们的船只，店主们打扫着鹅卵石街道。新鲜面包的香气从街角的面包店飘出，与海边咸咸的空气混合在一起。',
    '在一条蜿蜒的乡村小路尽头有一座小图书馆。里面，高大的木制书架上摆满了按主题和作者排列的成千上万本书。阳光透过彩色玻璃窗洒进来，在磨损的地毯上绘出色彩斑斓的图案。',
  ],
  hi: [
    'सुबह का सूरज शांत मैदान पर कोमल रोशनी डाल रहा था। ऊँचे ओक के पेड़ों से पक्षियों की आवाज़ आ रही थी और हल्की हवा घाटी में जंगली फूलों की खुशबू लेकर बह रही थी। एक छोटी सी धारा काई से ढके पत्थरों के बीच बह रही थी, उसका पानी साफ़ और ठंडा था।',
    'जब सूरज की रोशनी हवा में बारिश की बूँदों से टकराती है, तो वह झुककर इंद्रधनुष बनाती है। हर रंग आकाश में एक चौड़े चाप में प्रकट होता है, बाहर लाल से शुरू होकर अंदर बैंगनी पर खत्म होता है। लोग सदियों से इस सुंदर घटना का अध्ययन करते आ रहे हैं।',
    'बंदरगाह वाला शहर हर सुबह सूरज उगने से पहले जाग जाता था। मछुआरे अपनी नावें तैयार करते थे जबकि दुकानदार पक्की सड़कों की सफ़ाई करते थे। ताज़ी रोटी की खुशबू कोने की बेकरी से आती थी और समुद्र की नमकीन हवा में घुल जाती थी।',
    'एक टेढ़े-मेढ़े गाँव के रास्ते के अंत में एक छोटा सा पुस्तकालय था। अंदर, ऊँची लकड़ी की अलमारियों में विषय और लेखक के अनुसार व्यवस्थित हज़ारों किताबें रखी थीं। रंगीन काँच की खिड़कियों से सूरज की रोशनी अंदर आती थी।',
  ],
  ar: [
    'ألقت شمس الصباح ضوءاً ناعماً على المرج الهادئ. كانت الطيور تغنّي من أشجار البلوط الطويلة بينما حملت نسمة لطيفة رائحة الزهور البرية عبر الوادي. تعرّج جدول صغير بين الأحجار المغطاة بالطحالب، ومياهه صافية وباردة. بدا المشهد الهادئ وكأنه من كتاب قصص منسي.',
    'عندما يصطدم ضوء الشمس بقطرات المطر في الهواء، ينحني الضوء ويشكل قوس قزح. يظهر كل لون في قوس واسع عبر السماء، بدءاً من اللون الأحمر في الخارج وانتهاءً بالبنفسجي في الداخل. درس الناس هذه الظاهرة الجميلة منذ قرون.',
    'كانت مدينة الميناء تستيقظ كل صباح قبل شروق الشمس. كان الصيادون يجهّزون قواربهم بينما يكنس أصحاب المتاجر الشوارع المرصوفة بالحصى. كانت رائحة الخبز الطازج تنبعث من المخبز في الزاوية وتمتزج بهواء البحر المالح.',
    'كانت هناك مكتبة صغيرة في نهاية طريق ريفي متعرج. في الداخل، احتوت رفوف خشبية طويلة على آلاف الكتب المرتبة حسب الموضوع والمؤلف. كانت أشعة الشمس تتدفق عبر نوافذ زجاجية ملونة، وترسم أنماطاً ملوّنة على السجادة البالية.',
  ],
};

export function pickRandomParagraph(language: Language): string {
  const pool = SPEECH_PARAGRAPHS[language] ?? SPEECH_PARAGRAPHS.en;
  return pool[Math.floor(Math.random() * pool.length)];
}
