<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import BorderRadioBtn from '@/components/BorderRadioBtn.vue'
import Border from '@/components/Border.vue'
import RadioBtnRow from '@/components/RadioBtnRow.vue'
import RadioBtn from '@/components/RadioBtn.vue'
import DarkModeToggle from '@/components/DarkModeToggle.vue'
import RadioImageBtn from '@/components/RadioImageBtn.vue'
import { useVuelidate } from '@vuelidate/core'
import { required, minValue, maxValue } from '@vuelidate/validators'
import { set } from 'vue-demi'

onMounted(() => {
  navigator.geolocation.getCurrentPosition((position)=> {
      const p = position.coords;
      console.log(p.latitude, p.longitude);
  })
})

const store = useStore()
const damagesLevel = [
  'ระดับที่ 1 ไม่รุนแรงและรอซ่อมบำรุงในวาระ',
  'ระดับที่ 2 ควรเร่งซ่อม',
  'ระดับที่ 3 รุนแรงและควรซ่อมอย่างเร่งด่วน',
  'ระดับที่ 4 รุนแรงและเกิดความเสียหายต่อทรัพย์สิน/เกิดผลกระทบต่อสิ่งแวดล้อม',
  'ระดับที่ 5 รุนแรงและเกิดความเสียหายต่อทรัพย์สิน/เกิดผลกระทบต่อสิ่งแวดล้อมเป็นวงกว้าง'
]
const stations = [
  "กรุงเทพอภิวัฒน์",
  "กรุงเทพ",
  "ยมราช",
  "สามเสน",
  "ชุมทางบางซื่อ",
  "นิคมรถไฟ",
  "บางเขน",
  "ทุ่งสองห้อง",
  "หลักสี่",
  "ตลาดใหม่ดอนเมือง",
  "ดอนเมือง",
  "หลักหก",
  "คลองรังสิต",
  "รังสิต",
  "เชียงราก",
  "นวนคร",
  "เชียงรากน้อย",
  "เชียงรากน้อย",
  "คลองพุทรา",
  "บางปะอิน",
  "บ้านโพ",
  "อยุธยา",
  "บ้านม้า",
  "มาบพระจันทร์",
  "บ้านดอนกลาง",
  "พระแก้ว",
  "ชุมทางบ้านภาชี",
  "หนองวิวัฒน์",
  "บ้านปลักแรด",
  "ท่าเรือ",
  "บ้านหมอ",
  "หนองโดน",
  "บ้านกลับ",
  "บ้านป่าหวาย",
  "ลพบุรี",
  "ท่าแค",
  "โคกกะเทียม",
  "หนองเต่า",
  "หนองทรายขาว",
  "บ้านหมี่",
  "ห้วยแก้ว",
  "ไผ่ใหญ่",
  "จันเสน",
  "บ้านกกกว้าว",
  "ช่องแค",
  "ทะเลหว้า",
  "โพนทอง",
  "บ้านตาคลี",
  "ดงมะกุ",
  "หัวหวาย",
  "หนองโพ",
  "หัวงิ้ว",
  "เนินมะกอก",
  "เขาทอง",
  "นครสวรรค์",
  "ปากน้ำโพ",
  "ทับกฤช",
  "คลองปลากด",
  "ชุมแสง",
  "วังกร่าง",
  "บางมูลนาก",
  "หอไกร",
  "ดงตะขบ",
  "ตะพานหิน",
  "ห้วยเกตุ",
  "หัวดง",
  "วังกรด",
  "พิจิตร",
  "ท่าฬ่อ",
  "บางกระทุ่ม",
  "แม่เทียบ",
  "บ้านใหม่",
  "บึงพระ",
  "พิษณุโลก",
  "บ้านเต็งหนาม",
  "บ้านตูม",
  "แควน้อย",
  "พรหมพิราม",
  "หนองตม",
  "บ้านบุ่ง",
  "บ้านโคน",
  "พิชัย",
  "ไร่อ้อย",
  "ชุมทางบ้านดารา",
  "ชุมทางบ้านดารา",
  "คลองละมุง",
  "คลองมะพลับ",
  "วัดคลองปู",
  "คลองยาง",
  "หนองเรียง",
  "สวรรคโลก",
  "ท่าสัก",
  "ตรอน",
  "วังกะพี้",
  "อุตรดิตถ์",
  "ศิลาอาสน์",
  "ท่าเสา",
  "บ้านด่าน",
  "ปางต้นผึ้ง",
  "เขาพลึง",
  "ห้วยไร่",
  "ไร่เกล็ดดาว",
  "แม่พวก",
  "เด่นชัย",
  "ปากปาน",
  "แก่งหลวง",
  "ห้วยแม่ต้า",
  "บ้านปิน",
  "ผาคัน",
  "ผาคอ",
  "ปางป๋วย",
  "แม่จาง",
  "แม่เมาะ",
  "ห้วยรากไม้",
  "ศาลาผาลาด",
  "แม่ทะ",
  "หนองวัวเฒ่า",
  "นครลำปาง",
  "ห้างฉัตร",
  "ปางม่วง",
  "ห้วยเรียน",
  "แม่ตานน้อย",
  "ขุนตาน",
  "ทาชมภู",
  "ศาลาแม่ทา",
  "หนองหล่ม",
  "ลำพูน",
  "ป่าเส้า",
  "สารภี",
  "เชียงใหม่",
  "คลองหนึ่ง",
  "คลองหนึ่ง",
  "ดอนหญ้านาง",
  "การเคหะ",
  "บึงบอระเพ็ด",
  "ชุมทางบางซื่อ",
  "โรงเรียนจันเสน",
  "พหลโยธิน",
  "โรงพยาบาลรามาธิบดี",
  "ม.แกรนด์",
  "หนองกวย",
  "หนองแซง",
  "หนองสีดา",
  "บ้านป๊อกแป๊ก",
  "สระบุรี",
  "หนองบัว",
  "ชุมทางแก่งคอย",
  "บ้านช่องใต้",
  "เขาคอก",
  "เขาหินดาด",
  "หินซ้อน",
  "เขาสูง",
  "แก่งเสือเต้น",
  "บ้านหนองบัว",
  "โคกสลุง",
  "สุรนารายณ์",
  "โรงเรียนอัสสัมชัญคอนแวนต์",
  "เขายายกะตา",
  "ตลาดลำนารายณ์",
  "ลำนารายณ์",
  "บ้านเกาะรัง",
  "แผ่นดินทอง",
  "บ้านจงโก",
  "โคกคลี",
  "ช่องสำราญ",
  "บ้านวะตะแบก",
  "ห้วยยายจิ๋ว",
  "บ้านปากจาบ",
  "บำเหน็จณรงค์",
  "บ้านกลอย",
  "วังกะอาม",
  "โนนคร้อ",
  "จัตุรัส",
  "หนองฉิม",
  "บ้านตาเนิน",
  "บ้านหนองขาม",
  "บ้านเหลื่อม",
  "บ้านโคกกระเบื้อง",
  "บ้านหนองปรือโป่ง",
  "หนองพลวง",
  "บ้านเก่างิ้ว",
  "บ้านสระครก",
  "บ้านโสกรัง",
  "ทับกวาง",
  "มาบกะเบา",
  "ผาเสด็จ",
  "หินลับ",
  "มวกเหล็ก",
  "กลางดง",
  "ปางอโศก",
  "บันไดม้า",
  "ปากช่อง",
  "ซับม่วง",
  "จันทึก",
  "คลองขนานจิตร",
  "คลองไผ่",
  "ลาดบัวขาว",
  "บ้านใหม่สำโรง",
  "หนองน้ำขุ่น",
  "สีคิ้ว",
  "โคกสะอาด",
  "สูงเนิน",
  "กุดจิก",
  "โคกกรวด",
  "ภูเขาลาด",
  "นครราชสีมา",
  "ชุมทางถนนจิระ",
  "บ้านเกาะ",
  "หนองไข่น้ำ",
  "บ้านกระโดน",
  "หนองแมว",
  "โนนสูง",
  "บ้านดงพลอง",
  "บ้านมะค่า",
  "เนินถั่วแปบ",
  "พลสงคราม",
  "บ้านดอนใหญ่",
  "เมืองคง",
  "บ้านไร่",
  "โนนทองหลาง",
  "ห้วยระหัด",
  "ชุมทางบัวใหญ่",
  "เนินสวัสดิ์",
  "หนองบัวลาย",
  "ศาลาดิน",
  "หนองมะเขือ",
  "เมืองพล",
  "บ้านหัน",
  "บ้านไผ่",
  "บ้านแฮด",
  "หนองเม็ก",
  "ท่าพระ",
  "กุดกว้าง",
  "ขอนแก่น",
  "สำราญ",
  "โนนพยอม",
  "บ้านวังชัย",
  "น้ำพอง",
  "ห้วยเสียว",
  "เขาสวนกวาง",
  "โนนสะอาด",
  "ห้วยเกิ้ง",
  "กุมภวาปี",
  "ห้วยสามพาด",
  "หนองตะไก้",
  "คำกลิ้ง",
  "หนองขอนกว้าง",
  "อุดรธานี",
  "หนองตูม",
  "นาพู่",
  "คอกช้าง",
  "หนองบัวเงิน",
  "นาทา",
  "หนองคาย",
  "บ้านพะเนา",
  "บ้านพระพุทธ",
  "ท่าช้าง",
  "หนองมโนรมย์",
  "จักราช",
  "บ้านหินโคน",
  "หินดาษ",
  "ห้วยแถลง",
  "หนองกะทิง",
  "ลำปลายมาศ",
  "ทะเมนชัย",
  "บ้านแสลงพัน",
  "บ้านหนองตาด",
  "บุรีรัมย์",
  "บ้านตะโก",
  "ห้วยราช",
  "กระสัง",
  "หนองเต็ง",
  "ลำชี",
  "สุรินทร์",
  "บุฤาษี",
  "เมืองที",
  "กะโดนค้อ",
  "ศีขรภูมิ",
  "บ้านกะลัน",
  "สำโรงทาบ",
  "ห้วยทับทัน",
  "หนองแคน",
  "อุทุมพรพิสัย",
  "บ้านแต้",
  "บ้านเนียม",
  "ศรีสะเกษ",
  "เฉลิมกาญจนา",
  "หนองแวง",
  "บ้านคล้อ",
  "กันทรารมย์",
  "บ้านโนนผึ้ง",
  "ห้วยขยุง",
  "บ้านถ่อน",
  "บุ่งหวาย",
  "อุบลราชธานี",
  "บ้านหนองกันงา",
  "เขื่อนป่าสักชลสิทธิ์",
  "บ้านกระพี้",
  "ตลาดหนองคาย",
  "มักกะสัน",
  "แม่น้ำ",
  "ท่าเรือใหม่",
  "แม่น้ำ",
  "คลองตัน",
  "หัวหมาก",
  "บ้านทับช้าง",
  "ซอยวัดลานบุญ",
  "ลาดกระบัง",
  "หัวตะเข้",
  "บรรจุและแยกสินค้ากล่องที่ลาดกระบัง",
  "คลองหลวงแพ่ง",
  "คลองอุดมชลจร",
  "เปรง",
  "คลองแขวงกลั่น",
  "คลองบางพระ",
  "บางเตย",
  "ชุมทางฉะเชิงเทรา",
  "แปดริ้ว",
  "ดอนสีนนท์",
  "พานทอง",
  "ชลบุรี",
  "แสนสุข",
  "บางพระ",
  "เขาพระบาท",
  "ชุมทางศรีราชา",
  "แหลมฉบัง",
  "บางละมุง",
  "พัทยา",
  "พัทยาใต้",
  "บ้านห้วยขวาง",
  "สวนนงนุช",
  "ชุมทางเขาชีจรรย์",
  "บ้านพลูตาหลวง",
  "บางขวัญ",
  "โพรงอากาศ",
  "บางน้ำเปรี้ยว",
  "ชุมทางคลองสิบเก้า",
  "คลองยี่สิบเอ็ด",
  "โยทะกา",
  "บ้านสร้าง",
  "หนองน้ำขาว",
  "บ้านปากพลี",
  "ปราจีนบุรี",
  "หนองกระจับ",
  "โคกมะกอก",
  "ประจันตคาม",
  "หนองแสง",
  "บ้านดงบัง",
  "บ้านพรหมแสง",
  "บ้านเกาะแดง",
  "กบินทร์บุรี",
  "กบินทร์เก่า",
  "หนองสัง",
  "พระปรง",
  "บ้านแก้ง",
  "ศาลาลำดวน",
  "สระแก้ว",
  "ท่าเกษม",
  "ห้วยโจด",
  "วัฒนานคร",
  "บ้านโป่งคอม",
  "ห้วยเดื่อ",
  "อรัญประเทศ",
  "ไทย",
  "อุรุพงษ์",
  "พญาไท",
  "ราชปรารภ",
  "อโศก",
  "สุขุมวิท",
  "พระจอมเกล้า",
  "บ้านฉาง",
  "มาบตาพุด",
  "องครักษ์",
  "วิหารแดง",
  "บุใหญ่",
  "ญาณสังวราราม",
  "หนองศรีวิชัย",
  "ด่านพรมแดนบ้านคลองลึก",
  "ธนบุรี",
  "บางระมาด",
  "ชุมทางตลิ่งชัน",
  "บางบำหรุ",
  "บ้านฉิมพลี",
  "ศาลาธรรมสพน์",
  "ศาลายา",
  "วัดสุวรรณ",
  "คลองมหาสวัสดิ์",
  "วัดงิ้วราย",
  "นครชัยศรี",
  "ท่าแฉลบ",
  "ต้นสำโรง",
  "นครปฐม",
  "พระราชวังสนามจันทร์",
  "โพรงมะเดื่อ",
  "คลองบางตาล",
  "ชุมทางหนองปลาดุก",
  "ชุมทางหนองปลาดุก",
  "ยางประสาท",
  "ดอนขุนวิเศษ",
  "กำแพงแสน",
  "ทุ่งบัว",
  "หนองฟัก",
  "โรงเรียนการบิน",
  "หนองวัลย์เปรียง",
  "ศรีสำราญ",
  "ดอนสงวน",
  "ดอนทอง",
  "หนองผักชี",
  "บ้านมะขามล้ม",
  "สะแกย่างหมู",
  "สุพรรณบุรี",
  "ถนนทรงพล",
  "สระโกสินารายณ์",
  "ลูกแก",
  "ท่าเรือน้อย",
  "บ้านหนองเสือ",
  "ทุ่งทอง",
  "ปากแพรก",
  "กาญจนบุรี",
  "สะพานแควใหญ่",
  "เขาปูน",
  "วังลาน",
  "นากาญจน์",
  "วังเย็น",
  "วังตะเคียน",
  "บ้านโป่งเสี้ยว",
  "บ้านเก่า",
  "ท่าตาเสือ",
  "ท่ากิเลน",
  "วังสิงห์",
  "ลุ่มสุ่ม",
  "สะพานถ้ำกระแซ",
  "วังโพ",
  "เกาะมหามงคล",
  "ช่องแคบ",
  "วังใหญ่",
  "น้ำตก",
  "บ้านโป่ง",
  "นครชุมน์",
  "คลองตาคด",
  "โพธาราม",
  "เจ็ดเสมียน",
  "บ้านกล้วย",
  "สะพานจุฬาลงกรณ์",
  "ราชบุรี",
  "บ้านคูบัว",
  "บ่อตะคร้อ",
  "บ้านป่าไก่",
  "ปากท่อ",
  "ห้วยโรง",
  "บางเค็ม",
  "เขาย้อย",
  "หนองปลาไหล",
  "บางจาก",
  "เพชรบุรี",
  "เขาทโมน",
  "หนองไม้เหลือง",
  "หนองจอก",
  "หนองศาลา",
  "ชะอำ",
  "ห้วยทรายเหนือ",
  "ห้วยทรายใต้",
  "หัวหิน",
  "หนองแก",
  "สวนสนประดิพัทธ์",
  "เขาเต่า",
  "วังก์พง",
  "ปราณบุรี",
  "ห้วยขวาง",
  "หนองคาง",
  "สามร้อยยอด",
  "สังกระทาย",
  "กุยบุรี",
  "บ่อนอก",
  "ทุ่งมะเม่า",
  "คั่นกระได",
  "ประจวบคีรีขันธ์",
  "หนองหิน",
  "หว้ากอ",
  "วังด้วน",
  "ห้วยยาง",
  "ทุ่งประดู่",
  "ทับสะแก",
  "ดอนทราย",
  "โคกตาหอม",
  "บ้านกรูด",
  "หนองมงคล",
  "นาผักขวง",
  "บางสะพานใหญ่",
  "หินกอง",
  "ชะม่วง",
  "บางสะพานน้อย",
  "ห้วยสัก",
  "บ้านทรายทอง",
  "เขาไชยราช",
  "มาบอำมฤต",
  "บ้านทรัพย์สมบูรณ์",
  "คลองวังช้าง",
  "ปะทิว",
  "บ้านคอกม้า",
  "สะพลี",
  "หนองเนียน",
  "นาชะอัง",
  "ชุมพร",
  "แสงแดด",
  "ทุ่งคา",
  "วิสัย",
  "บ้านครน",
  "สวี",
  "เขาสวนทุเรียน",
  "เขาปีบ",
  "ปากตะโก",
  "ท่าทอง",
  "ควนหินมุ้ย",
  "หลังสวน",
  "คลองขนาน",
  "หัวมาด",
  "ละแม",
  "บ้านดวด",
  "คันธุลี",
  "ดอนธูป",
  "ท่าชนะ",
  "บ้านเกาะมุกข์",
  "เขาพนมแบก",
  "ไชยา",
  "ท่าฉาง",
  "คลองขุด",
  "คลองไทร",
  "มะลวน",
  "ชุมทางบ้านทุ่งโพธิ์",
  "บ้านดอนรัก",
  "บ้านทุ่งหลวง",
  "บ้านขนาย",
  "บ้านดอนเรียบ",
  "คลองยัน",
  "เขาหลุง",
  "บ้านยาง",
  "คีรีรัฐนิคม",
  "สุราษฎร์ธานี",
  "เขาหัวควาย",
  "บ่อกรัง",
  "เขาพลู",
  "คลองยา",
  "บ้านนา",
  "ห้วยมุด",
  "นาสาร",
  "คลองปราบ",
  "พรุพี",
  "คลองสูญ",
  "บ้านส้อง",
  "บ้านพรุกระแชง",
  "ห้วยปริก",
  "กระเบียด",
  "ทานพอ",
  "ฉวาง",
  "คลองจันดี",
  "หลักช้าง",
  "คลองกุย",
  "นาบอน",
  "คลองจัง",
  "ชุมทางทุ่งสง",
  "ที่วัง",
  "บ้านพูน",
  "กะปาง",
  "ควนเมา",
  "คลองมวน",
  "ยางยวน",
  "ห้วยยอด",
  "ลำภูรา",
  "ตรัง",
  "นาป้อ",
  "พรุใหญ่",
  "บ้านป่ากอ",
  "กันตัง",
  "ใสใหญ่",
  "ช่องเขา",
  "ร่อนพิบูลย์",
  "ชุมทางเขาชุมทอง",
  "บ้านเกยเชน",
  "บ้านทุ่งหล่อ",
  "โคกคราม",
  "บ้านห้วยยูง",
  "บ้านท่าช้าง",
  "วังวัว",
  "มะม่วงสองต้น",
  "นครศรีธรรมราช",
  "ควนหนองคว้า",
  "บ้านตูล",
  "ชะอวด",
  "หนองจิก",
  "บ้านนางหลง",
  "บ้านขอนหาด",
  "แหลมโตนด",
  "บ้านสุนทรา",
  "ปากคลอง",
  "บ้านมะกอกใต้",
  "ชัยบุรี",
  "พัทลุง",
  "นาปรือ",
  "บ้านค่ายไทย",
  "บ้านต้นโดน",
  "บ้านห้วยแตน",
  "เขาชัยสน",
  "บางแก้ว",
  "ควนพระ",
  "ควนเคี่ยม",
  "หารกง",
  "หารเทา",
  "วัดควนเผยอ",
  "โคกทราย",
  "ควนเนียง",
  "บ้านเกาะใหญ่",
  "บางกล่ำ",
  "บ้านดินลาน",
  "ชุมทางหาดใหญ่",
  "บ้านทุ่งค่าย",
  "คลองแงะ",
  "ปาดังเบซาร์",
  "สทล.",
  "นาม่วง",
  "วัดควนมีด",
  "จะนะ",
  "ท่าแมงลัก",
  "เกาะสะบ้า",
  "เทพา",
  "ตาแปด",
  "บ้านนิคม",
  "ปัตตานี",
  "นาประดู่",
  "ป่าไร่",
  "คลองทราย",
  "ตาเซะ",
  "บ้านยุโป",
  "ยะลา",
  "ไม้แก่น",
  "บ้านปาแต",
  "รามัน",
  "บาลอ",
  "รือเสาะ",
  "บ้านสะโลว์บูกิ๊ตยือแร",
  "ลาโละ",
  "มะรือโบ",
  "กะแด๊ะ",
  "ตันหยงมัส",
  "ป่าไผ่",
  "เจาะไอร้อง",
  "บูกิต",
  "ไอสะเตีย",
  "โต๊ะเด็ง",
  "สุไหงปาดี",
  "โคกสยา",
  "สุไหงโก-ลก",
  "บ้านเกาะปริง",
  "จรัลสนิทวงศ์",
  "บ้านตรอกแค",
  "บ้านพุพง",
  "วัดช้างให้",
  "พุทธมณฑล",
  "วงเวียนใหญ่",
  "ตลาดพลู",
  "คลองต้นไทร",
  "จอมทอง",
  "วัดไทร",
  "วัดสิงห์",
  "บางบอน",
  "การเคหะ",
  "รางสะแก",
  "รางโพธิ์",
  "สามแยก",
  "พรมแดน",
  "บางน้ำจืด",
  "คอกควาย",
  "บ้านขอม",
  "มหาชัย",
  "บ้านแหลม",
  "ท่าฉลอม",
  "บ้านชีผ้าขาว",
  "บางสีคต",
  "บางกระเจ้า",
  "บ้านบ่อ",
  "บางโทรัด",
  "บ้านกาหลง",
  "บ้านนาขวาง",
  "บ้านนาโคก",
  "เขตเมือง",
  "ลาดใหญ่",
  "บางกระบูน",
  "แม่กลอง",
  "คลองจาก",
  "ทุ่งสีทอง",
  "คลองนกเล็ก",
  "อลอร์สตาร์",
  "บูกิตเมอร์ตายัน",
  "บัตเตอร์เวอร์ธ"
]
const damageProperties = [ 'แตกหัก', 'แตกร้าว', 'สึกหรอ', 'รางคดงอ', 'เกิดสนิม/กัดกร่อน', 'เป็นแผล/เสียรูป เสียเนื้อโลหะ/เพียงบางส่วน' ]
const damageAraePrperties = [ 'พื้นที่ลาดชัน', 'พื้นที่รัสมีโค้ง', 'ใกล้สถานีรถไฟ', 'บริเวณอุโมงค์', 'สะพาน', 'มีน้ำท่วมขัง' ]
const integrity = ['สมบูรณ์', 'ไม่สมบูรณ์']
const ballast = ['สมบูรณ์', 'ไม่สมบูรณ์', 'พร่อง', 'มีลักษณะกลม']
const sleeper = ['สมบูรณ์', 'ไม่สมบูรณ์', 'ทรุดตัว', 'แตกหัก', 'ให้ตัวได้', 'ประกับยึดรางหลวม']
const analyse = ['เห็นควรดำเนินการ', 'ไม่จำเป็นต้องส่งวิเคราะห์']
const positionDamage = [
  {
    title: 'รอยต่อราง (Fish Plate)',
    img: 'positionDamage/Picture2.png'
  },
  {
    title: 'แนวเชื่อมต่อราง',
    img: 'positionDamage/Picture3.png'
  },
  {
    title: 'รางปกติ',
    img: 'positionDamage/Picture4.png'
  },
  {
    title: 'รอยเชื่อมซ่อม',
    img: 'positionDamage/Picture5.png'
  },
  {
    title: 'ประแจ',
    img: 'positionDamage/Picture6.png'
  },
  {
    title: 'จุดตัดราง',
    img: 'positionDamage/Picture7.png'
  }
]
const scar = [
  {
    title: 'Crushed Head',
    img: 'scar/Picture1.png'
  },
  {
    title: 'Head Checking',
    img: 'scar/Picture2.png'
  },
  {
    title: 'Spalling',
    img: 'scar/Picture3.png'
  },
  {
    title: 'Side Wear',
    img: 'scar/Picture4.png'
  },
  {
    title: 'Shelling',
    img: 'scar/Picture5.png'
  },
  {
    title: 'Burned Rail',
    img: 'scar/Picture6.png'
  },
]
const trackGeometry = [
  {
    title: 'Alignment',
    img: 'trackGeometry/Picture1.png'
  },
  {
    title: 'Track Guage',
    img: 'trackGeometry/Picture2.png'
  },
  {
    title: 'Longitudinal Level',
    img: 'trackGeometry/Picture3.png'
  },
  {
    title: 'Super Elevation',
    img: 'trackGeometry/Picture4.png'
  },
  {
    title: 'Twist',
    img: 'trackGeometry/Picture5.png'
  }
]
const guageType = [
  { name: 'เกจแคบ (Narrow gauge)', value: 'narrowGauge' },
  { name: 'เกจมาตรฐานยุโรป (European Standard gauge)', value: 'europeanStandardGauge' },
  { name: 'เกจกว้าง (Broad gauge)', value: 'broadGauge' }
]
const signaturePad = ref(null)
const undo = () => {
  signaturePad.value.undoSignature()
}
const save = () => {
  const { isEmpty, data } = signaturePad.value.saveSignature()
  console.log(isEmpty)
  console.log(data)
}
const clear = () => {
  signaturePad.value.clearSignature()
}
const railSurvey = reactive({
  date: null,
  trafficArea: null,
  damagedArea: {
    GPSCoordinates: null,
    kmTelegraphPoles: null,
    nearby: [],
  },
  railType: null,
  damageSeverity: null,
  railDamagePoint: null,
  natureDamage: null,
  natureAreaDamage: null,
  integrityRail: null,
  trackGeometry: null,
  irregularTrackGeometryPattern: null,
  ballast: null,
  sleeper: null,
  track: null,
  maintenanceRecord: null,
  lastMaintenance: null,
  manyTimeMaintenance: null,
  maintenanceMethod: null,
  analyzeDamage: null,
  damageSurveyorOpinion: null,
  signature: null
})

const rules = {
  date: { required  },
  trafficArea: { required  },
  damagedArea: {
    GPSCoordinates: { required },
    kmTelegraphPoles: { required },
    nearby: { required }
  },
  damageSeverity: { required  },
  railDamagePoint: { required  },
  natureDamage: { required  },
  natureAreaDamage: { required  },
  integrityRail: { required  },
  trackGeometry: { required  },
  irregularTrackGeometryPattern: { required  },
  ballast: { required  },
  sleeper: { required  },
  track: { required  },
  maintenanceRecord: { required  },
  lastMaintenance: { required  },
  manyTimeMaintenance: { required, minValue: minValue(0), maxValue: maxValue(365)  },
  maintenanceMethod: { required  },
  analyzeDamage: { required }
}

const v$ = useVuelidate(rules, railSurvey, { $autoDirty: true })

// METHOD //
const handleSubmit = async () => {
  await v$.value.$validate()
}
const handleGetLocation = () => {
  navigator.geolocation.getCurrentPosition((position) => {
      const p = position.coords;
      // console.log(p.latitude, p.longitude);
      railSurvey.damagedArea.GPSCoordinates = `${p.latitude}, ${p.longitude}`
  })
}

// COMPUTED //
const compMARec = computed(() => {
  return v$.value.maintenanceRecord.$error
    // || v$.value.lastMaintenance.$error
    // || v$.value.manyTimeMaintenance.$error
    || v$.value.maintenanceMethod.$error
})

const compAraeDamage = computed(() => {
  return v$.value.damagedArea.GPSCoordinates.$error
    || v$.value.damagedArea.kmTelegraphPoles.$error
    || v$.value.damagedArea.nearby.$error
})

const compDate = computed({
  get() {
    return railSurvey.date
  },
  set(newValue) {
    return railSurvey.date = newValue
  }
})



</script>
<template>
  <!-- 2023-01-07 -->
  <!-- {{ new Date().toISOString() }} -->
  <div class="container">
    <!-- {{ store.state }} -->
    <!-- <button @click="store.commit('increment')">+</button>
    <button @click="store.commit('toggleDarkMode')">Toggle</button>
    <DarkModeToggle></DarkModeToggle> -->
    <div class="flex flex-col gap-4">
      <!-- วันที่สำรวจ -->
      <Border>
        <div class="flex md:flex-row flex-col gap-4">
          <div class="flex-1">
            <label class="_label-sm">วันที่สำรวจ</label>
            <input v-model="railSurvey.date" type="date" id="date" :class="v$.date.$error ? '_input_error' : '_input'" required>
            <p v-if="v$.date.$error" class="text-sm text-red-600">{{ v$.date.$errors[0].$message }}</p>
          </div>
          <div class="flex-1">
            <label class="_label-sm">เขตการเดินรถ</label>
            <select v-model="railSurvey.trafficArea" id="trafficArea" :class="v$.trafficArea.$error ? '_input_error' : '_input'">
              <option>United States</option>
              <option>Canada</option>
              <option>France</option>
              <option>Germany</option>
            </select>
            <p v-if="v$.trafficArea.$error" class="text-sm text-red-600">{{ v$.trafficArea.$errors[0].$message }}</p>
          </div>
        </div>
      </Border>
      <Border>
        <label class="block mb-2 text-lg font-semibold text-gray-900 dark:text-white">พื้นที่เกิดความเสียหาย</label>
        <div class="flex flex-col gap-4">
          <div class="flex md:flex-row flex-col gap-4">
            <div class="flex-1">
              <label class="_label-sm">พิกัด GPS</label>
              <input v-model="railSurvey.damagedArea.GPSCoordinates" @click="handleGetLocation()" type="text" id="GPSCoordinates" :class="v$.damagedArea.GPSCoordinates.$error ? '_input_error' : '_input' " required>
              <p v-if="v$.damagedArea.GPSCoordinates.$error" class="text-sm text-red-600">{{ v$.trafficArea.$errors[0].$message }}</p>
            </div>
            <div class="flex-1">
              <label class="_label-sm">หลักกิโลเมตร/เสาโทรเลข</label>
              <input v-model="railSurvey.damagedArea.kmTelegraphPoles" type="text" id="kmTelegraphPoles" :class="v$.damagedArea.kmTelegraphPoles.$error ? '_input_error' : '_input' " required>
            </div>
          </div>
          <div class="flex flex-col">
            <label class="_label-sm">สถานีรถไฟใกล้เคียง</label>
            <div class="flex md:flex-row flex-col gap-4">
              <select id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option disabled :value="null">กรุณาเลือกสถานี</option>
                <option v-for="station in stations" :key="station">{{ station }}</option>
              </select>
              <select id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option disabled :value="null">กรุณาเลือกสถานี</option>
                <option v-for="station in stations" :key="station">{{ station }}</option>
              </select>
            </div>
          </div>
          <div class="flex flex-col">
            <label class="_label-lg">ชนิดของราง</label>
            <label class="_label-sm">มาตรฐานและเกรด</label>
            <div class="max-w-md">
              <select v-model="railSurvey.railType" id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option disabled :value="null">กรุณาเลือกประเภทของเกจ</option>
                <option v-for="(g ,index) in guageType" :key="index" :value="g.value">{{ g.name }}</option>
              </select>
            </div>
          </div>
        </div>
      </Border>
      <Border :error="v$.damageSeverity.$error">
        <label class="_label-lg">ความรุนแรงของความเสียหาย</label>
        <div class="grid md:grid-cols-2 sm:grid-cols-1 gap-4">
          <RadioBtn v-model="railSurvey.damageSeverity" name="positionDamage" :items="damagesLevel"></RadioBtn>
        </div>
      </Border>
      <Border>
        <p class="text-lg font-semibold mb-4">ตำแหน่งที่เกิดความเสียหายของราง</p>
        <div class="flex flex-wrap gap-8">
          <div class="flex items-center">
            <img src="@/assets/positionDamage/Picture1.png" alt="positionDamage" class="h-40">
          </div>
          <div class="ml-12">
            <div>
              <input type="radio" value="" name="rail" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
              <label class="ml-4 text-sm font-medium text-gray-900 dark:text-gray-300">หัวราง</label>
            </div>
            <div>
              <input type="radio" value="" name="rail" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
              <label class="ml-4 text-sm font-medium text-gray-900 dark:text-gray-300">หัวราง</label>
            </div>
            <div>
              <input type="radio" value="" name="rail" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
              <label class="ml-4 text-sm font-medium text-gray-900 dark:text-gray-300">หัวราง</label>
            </div>
          </div>
          <RadioImageBtn name="positionDamage" :items="positionDamage" imageLabel="title" imagePath="img"></RadioImageBtn>
        </div>
      </Border>
      <Border :error="v$.natureDamage.$error">
        <label class="_label-lg">ลักษณะความเสียหาย</label>
        <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
          <RadioBtn v-model="railSurvey.natureDamage" name="positionDamage" :items="damageProperties"></RadioBtn>
        </div>
      </Border>
      <Border :error="v$.railDamagePoint.$error">
        <label class="_label-lg">ให้ระบุลักษณะแผล โดยดูรูปต่อไปนี้ประกอบ</label>
        <RadioImageBtn v-model="railSurvey.railDamagePoint" name="scar" :items="scar" imageLabel="title" imagePath="img"></RadioImageBtn>
      </Border>
      <Border :error="v$.natureAreaDamage.$error">
        <label class="_label-lg">ลักษณะพื้นที่ที่เกิดความเสียหาย</label>
        <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
          <RadioBtn v-model="railSurvey.natureAreaDamage" name="damageAraePrperties" :items="damageAraePrperties"></RadioBtn>
        </div>
      </Border>
      <Border :error="v$.integrityRail.$error || v$.trackGeometry.$error ">
        <div class="flex flex-col gap-4">
          <div>
            <label class="_label-lg">ความสมบูรณ์ของทาง</label>
            <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
              <RadioBtn v-model="railSurvey.integrityRail" name="pt" :items="integrity"></RadioBtn>
            </div>
          </div>
          <div>
            <label class="_label-lg">Track Geometry</label>
            <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
              <RadioBtn v-model="railSurvey.trackGeometry" name="tg" :items="integrity"></RadioBtn>
            </div>
          </div>
        </div>
      </Border>
      <Border :error="v$.irregularTrackGeometryPattern.$error">
        <label class="_label-lg">รูปแบบ Track Geometry ที่ผิดปกติ</label>
        <RadioImageBtn v-model="railSurvey.irregularTrackGeometryPattern" name="abtg" :items="trackGeometry" imageLabel="title" imagePath="img"></RadioImageBtn>
      </Border>
      <Border :error="v$.ballast.$error">
        <label class="_label-lg">หินโรยทาง (Ballast)</label>
        <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
          <RadioBtn v-model="railSurvey.ballast" name="ballast" :items="ballast"></RadioBtn>
        </div>
      </Border>
      <Border :error="v$.sleeper.$error">
        <label class="_label-lg">หมอนรองทาง (Sleeper)</label>
        <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
          <RadioBtn v-model="railSurvey.sleeper" name="sleeper" :items="sleeper"></RadioBtn>
        </div>
      </Border>
      <Border :error="v$.track.$error">
        <label class="_label-lg">คันทาง</label>
        <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
          <RadioBtn v-model="railSurvey.track" name="track" :items="integrity"></RadioBtn>
        </div>
      </Border>
      <Border :error="compMARec">
        <label class="_label-lg">ประวัติการซ่อมบำรุง</label>
        <div class="flex flex-col gap-4">
          <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
            <RadioBtn v-model="railSurvey.maintenanceRecord" name="his" :items="['เคย', 'ไม่เคย']"></RadioBtn>
          </div>
          <div class="flex md:flex-row flex-col gap-4">
            <div class="flex-1">
              <label class="_label-sm">การซ่อมบำรุงครั้งล่าสุด</label>
              <input v-model="railSurvey.lastMaintenance" type="date" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@flowbite.com" required>
              <p v-if="v$.lastMaintenance.$error" class="text-sm text-red-600">{{ v$.lastMaintenance.$errors[0].$message }}</p>
            </div>
            <div class="flex-1">
              <label class="_label-sm">ความถี่ในการซ่อมบำรุงในรอบปี</label>
              <input v-model="railSurvey.manyTimeMaintenance" type="number" :min="0" :max="365" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
              <p v-if="v$.manyTimeMaintenance.$error" class="text-sm text-red-600">{{ v$.manyTimeMaintenance.$errors[0].$message }}</p>
            </div>
          </div>
          <div>
            <label class="_label-lg">วิธีซ่อมบำรุง</label>
            <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
              <RadioBtn v-model="railSurvey.maintenanceMethod" name="ma" :items="['เชื่อมซ่อม', 'ตัดเปลี่ยนราง']"></RadioBtn>
            </div>
          </div>
        </div>
      </Border>
      <Border :error="v$.analyzeDamage.$error">
        <label class="_label-lg">ควรส่งห้องปฏิบัติการเพื่อทำการวิเคราะห์สาเหตุของความเสียหาย</label>
        <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
          <RadioBtn v-model="railSurvey.analyzeDamage" name="positionDamage" :items="analyse"></RadioBtn>
        </div>
      </Border>
      <Border>
        <label class="_label-lg">ความคิดเห็นของผู้สำรวจความเสียหาย</label>
        <textarea v-model="railSurvey.damageSurveyorOpinion" rows="4" class="_input" placeholder=""></textarea>
      </Border>
      <div class="flex justify-end">
        <div class="w-1/2">
          <Border>
            <div class="h-20">
              <VueSignaturePad ref="signaturePad" />
            </div>
            <label class="pt-2 flex flex-col items-center text-sm font-medium text-gray-900 dark:text-white">ผู้สำรวจและบันทึกความเสียหาย</label>
          </Border>
        </div>
      </div>
      <div class="flex mx-auto">
        <button class="mx-4 px-4 py-3 bg-gray-300 text-gray-900 text-xs font-semibold rounded hover:bg-gray-400" @click="save">Save</button>
        <button class="mx-4 px-4 py-3 bg-gray-300 text-gray-900 text-xs font-semibold rounded hover:bg-gray-400" @click="undo">Undo</button>
        <button class="mx-4 px-4 py-3 bg-gray-300 text-gray-900 text-xs font-semibold rounded hover:bg-gray-400" @click="clear">Clear</button>
        <button class="mx-4 px-4 py-3 bg-gray-300 text-gray-900 text-xs font-semibold rounded hover:bg-gray-400" @click="handleSubmit()">Submit</button>
      </div>
    </div>
  </div>
</template>