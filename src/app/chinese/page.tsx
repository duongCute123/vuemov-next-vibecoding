"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Vocabulary = {
  id: number;
  chinese: string;
  pinyin: string;
  vietnamese: string;
  audio?: string;
};

type Lesson = {
  id: number;
  title: string;
  vocabulary: Vocabulary[];
};

const lessons: Lesson[] = [
  {
    id: 1,
    title: "Chào hỏi",
    vocabulary: [
      { id: 1, chinese: "你好", pinyin: "nǐ hǎo", vietnamese: "Xin chào" },
      { id: 2, chinese: "早上好", pinyin: "zǎo shàng hǎo", vietnamese: "Chào buổi sáng" },
      { id: 3, chinese: "再见", pinyin: "zài jiàn", vietnamese: "Tạm biệt" },
      { id: 4, chinese: "谢谢", pinyin: "xiè xie", vietnamese: "Cảm ơn" },
      { id: 5, chinese: "不客气", pinyin: "bù kè qì", vietnamese: "Không có gì" },
    ]
  },
  {
    id: 2,
    title: "Số đếm",
    vocabulary: [
      { id: 1, chinese: "一", pinyin: "yī", vietnamese: "Một" },
      { id: 2, chinese: "二", pinyin: "èr", vietnamese: "Hai" },
      { id: 3, chinese: "三", pinyin: "sān", vietnamese: "Ba" },
      { id: 4, chinese: "四", pinyin: "sì", vietnamese: "Bốn" },
      { id: 5, chinese: "五", pinyin: "wǔ", vietnamese: "Năm" },
      { id: 6, chinese: "六", pinyin: "liù", vietnamese: "Sáu" },
      { id: 7, chinese: "七", pinyin: "qī", vietnamese: "Bảy" },
      { id: 8, chinese: "八", pinyin: "bā", vietnamese: "Tám" },
      { id: 9, chinese: "九", pinyin: "jiǔ", vietnamese: "Chín" },
      { id: 10, chinese: "十", pinyin: "shí", vietnamese: "Mười" },
    ]
  },
  {
    id: 3,
    title: "Gia đình",
    vocabulary: [
      { id: 1, chinese: "爸爸", pinyin: "bà ba", vietnamese: "Bố" },
      { id: 2, chinese: "妈妈", pinyin: "mā ma", vietnamese: "Mẹ" },
      { id: 3, chinese: "哥哥", pinyin: "gē ge", vietnamese: "Anh trai" },
      { id: 4, chinese: "姐姐", pinyin: "jiě jie", vietnamese: "Chị gái" },
      { id: 5, chinese: "弟弟", pinyin: "dì di", vietnamese: "Em trai" },
      { id: 6, chinese: "妹妹", pinyin: "mèi mei", vietnamese: "Em gái" },
    ]
  },
  {
    id: 4,
    title: "Màu sắc",
    vocabulary: [
      { id: 1, chinese: "红色", pinyin: "hóng sè", vietnamese: "Màu đỏ" },
      { id: 2, chinese: "蓝色", pinyin: "lán sè", vietnamese: "Màu xanh dương" },
      { id: 3, chinese: "绿色", pinyin: "lǜ sè", vietnamese: "Màu xanh lá" },
      { id: 4, chinese: "黄色", pinyin: "huáng sè", vietnamese: "Màu vàng" },
      { id: 5, chinese: "白色", pinyin: "bái sè", vietnamese: "Màu trắng" },
      { id: 6, chinese: "黑色", pinyin: "hēi sè", vietnamese: "Màu đen" },
    ]
  },
  {
    id: 5,
    title: "Thời gian",
    vocabulary: [
      { id: 1, chinese: "今天", pinyin: "jīn tiān", vietnamese: "Hôm nay" },
      { id: 2, chinese: "明天", pinyin: "míng tiān", vietnamese: "Ngày mai" },
      { id: 3, chinese: "昨天", pinyin: "zuó tiān", vietnamese: "Hôm qua" },
      { id: 4, chinese: "现在", pinyin: "xiàn zài", vietnamese: "Bây giờ" },
      { id: 5, chinese: "早上", pinyin: "zǎo shàng", vietnamese: "Buổi sáng" },
      { id: 6, chinese: "晚上", pinyin: "wǎn shàng", vietnamese: "Buổi tối" },
    ]
  },
];

const radicals = [
  { char: "氵", name: "Thủy thảo", meaning: "Nước" },
  { char: "木", name: "Mộc", meaning: "Cây gỗ" },
  { char: "艹", name: "Thảo", meaning: "Cỏ" },
  { char: "扌", name: "Thủ thủ", meaning: "Tay" },
  { char: "心", name: "Tâm", meaning: "Tâm trí" },
  { char: "忄", name: "Tâm tư", meaning: "Tâm trí" },
  { char: "目", name: "Mục", meaning: "Mắt" },
  { char: "口", name: "Khẩu", meaning: "Miệng" },
];

const sentences = [
  { chinese: "我想学习中文。", pinyin: "Wǒ xiǎng xuéxí zhōngwén.", vietnamese: "Tôi muốn học tiếng Trung." },
  { chinese: "你叫什么名字？", pinyin: "Nǐ jiào shénme míngzì?", vietnamese: "Bạn tên gì?" },
  { chinese: "我是学生。", pinyin: "Wǒ shì xuéshēng.", vietnamese: "Tôi là học sinh." },
  { chinese: "今天天气很好。", pinyin: "Jīn tiān tiānqì hěn hǎo.", vietnamese: "Hôm nay trời đẹp." },
  { chinese: "多少钱？", pinyin: "Duō shǎo qián?", vietnamese: "Bao nhiêu tiền?" },
];

export default function ChineseLearning() {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [showVocabulary, setShowVocabulary] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [practiceMode, setPracticeMode] = useState(false);
  const [showRadicals, setShowRadicals] = useState(false);
  const [showSentences, setShowSentences] = useState(false);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const currentVocab = lessons[currentLesson].vocabulary[currentWordIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-zinc-900 to-amber-900 text-white">
      <div className="mx-auto max-w-4xl p-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black mb-2">🇨🇳 Học Tiếng Trung</h1>
          <p className="text-zinc-300">Luyện nói và học từ vựng tiếng Trung</p>
        </div>

        <div className="grid gap-4 mb-6">
          <div className="flex gap-2 flex-wrap justify-center">
            {lessons.map((lesson, idx) => (
              <button
                key={lesson.id}
                onClick={() => { setCurrentLesson(idx); setShowVocabulary(false); setCurrentWordIndex(0); }}
                className={`px-4 py-2 rounded-full font-semibold transition ${
                  currentLesson === idx
                    ? "bg-red-500 text-white"
                    : "bg-white/10 border border-white/20 hover:bg-white/20"
                }`}
              >
                {lesson.title}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4 mb-6 justify-center">
          <button
            onClick={() => { setShowVocabulary(!showVocabulary); setPracticeMode(false); setShowRadicals(false); setShowSentences(false); }}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 rounded-xl font-semibold"
          >
            📚 Từ vựng
          </button>
          <button
            onClick={() => { setPracticeMode(!practiceMode); setShowVocabulary(false); setShowRadicals(false); setShowSentences(false); }}
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 rounded-xl font-semibold"
          >
            🎤 Luyện nói
          </button>
          <button
            onClick={() => { setShowRadicals(!showRadicals); setShowVocabulary(false); setPracticeMode(false); setShowSentences(false); }}
            className="px-6 py-3 bg-green-500 hover:bg-green-400 rounded-xl font-semibold"
          >
            🔤 Bộ thành
          </button>
          <button
            onClick={() => { setShowSentences(!showSentences); setShowVocabulary(false); setPracticeMode(false); setShowRadicals(false); }}
            className="px-6 py-3 bg-purple-500 hover:bg-purple-400 rounded-xl font-semibold"
          >
            📝 Câu mẫu
          </button>
        </div>

        <AnimatePresence mode="wait">
          {showVocabulary && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-zinc-900/80 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">{lessons[currentLesson].title}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentWordIndex(Math.max(0, currentWordIndex - 1))}
                    disabled={currentWordIndex === 0}
                    className="px-3 py-1 bg-white/10 rounded-lg disabled:opacity-50"
                  >
                    ←
                  </button>
                  <span className="px-3 py-1 bg-white/10 rounded-lg">
                    {currentWordIndex + 1} / {lessons[currentLesson].vocabulary.length}
                  </span>
                  <button
                    onClick={() => setCurrentWordIndex(Math.min(lessons[currentLesson].vocabulary.length - 1, currentWordIndex + 1))}
                    disabled={currentWordIndex === lessons[currentLesson].vocabulary.length - 1}
                    className="px-3 py-1 bg-white/10 rounded-lg disabled:opacity-50"
                  >
                    →
                  </button>
                </div>
              </div>

              <div className="text-center mb-8">
                <div className="text-8xl font-bold mb-4 text-red-400">{currentVocab.chinese}</div>
                <div className="text-2xl text-cyan-300 mb-2">{currentVocab.pinyin}</div>
                <div className="text-xl text-zinc-300">{currentVocab.vietnamese}</div>
                <button
                  onClick={() => speak(currentVocab.chinese)}
                  className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-400 rounded-full font-semibold"
                >
                  🔊 Phát âm
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {lessons[currentLesson].vocabulary.map((vocab, idx) => (
                  <button
                    key={vocab.id}
                    onClick={() => setCurrentWordIndex(idx)}
                    className={`p-3 rounded-xl border transition ${
                      currentWordIndex === idx
                        ? "bg-red-500/30 border-red-400"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className="text-lg font-bold">{vocab.chinese}</div>
                    <div className="text-xs text-zinc-400">{vocab.pinyin}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {practiceMode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-zinc-900/80 rounded-2xl p-6"
            >
              <h2 className="text-2xl font-bold mb-6 text-center">🎤 Luyện nói</h2>
              
              <div className="space-y-4">
                {lessons[currentLesson].vocabulary.map((vocab) => (
                  <div key={vocab.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div>
                      <div className="text-2xl font-bold text-red-400">{vocab.chinese}</div>
                      <div className="text-zinc-400">{vocab.pinyin}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => speak(vocab.chinese)}
                        className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 rounded-lg"
                      >
                        🔊 Nghe
                      </button>
                      <button
                        onClick={() => speak(vocab.pinyin)}
                        className="px-4 py-2 bg-purple-500 hover:bg-purple-400 rounded-lg"
                      >
                        📖 Pinyin
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-amber-500/20 rounded-xl text-center">
                <p className="text-amber-300">💡 Mẹo: Nhấn nút "Nghe" rồi lặp theo để luyện phát âm</p>
              </div>
            </motion.div>
          )}

          {showRadicals && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-zinc-900/80 rounded-2xl p-6"
            >
              <h2 className="text-2xl font-bold mb-6 text-center">🔤 Bộ thành (Radicals)</h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {radicals.map((radical) => (
                  <div key={radical.char} className="p-4 bg-white/5 rounded-xl text-center">
                    <div className="text-4xl font-bold text-red-400 mb-2">{radical.char}</div>
                    <div className="font-semibold">{radical.name}</div>
                    <div className="text-sm text-zinc-400">{radical.meaning}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-green-500/20 rounded-xl">
                <p className="text-green-300">📚 Bộ thành là các ký tự cơ bản trong chữ Hán, giúp nhận diện và học nhanh hơn!</p>
              </div>
            </motion.div>
          )}

          {showSentences && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-zinc-900/80 rounded-2xl p-6"
            >
              <h2 className="text-2xl font-bold mb-6 text-center">📝 Câu mẫu</h2>
              
              <div className="space-y-4">
                {sentences.map((sentence, idx) => (
                  <div key={idx} className="p-4 bg-white/5 rounded-xl">
                    <div className="text-2xl font-bold text-red-400 mb-2">{sentence.chinese}</div>
                    <div className="text-cyan-300 mb-1">{sentence.pinyin}</div>
                    <div className="text-zinc-300">{sentence.vietnamese}</div>
                    <button
                      onClick={() => speak(sentence.chinese)}
                      className="mt-2 px-3 py-1 bg-cyan-500/30 hover:bg-cyan-500/50 rounded-lg text-sm"
                    >
                      🔊 Phát âm
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!showVocabulary && !practiceMode && !showRadicals && !showSentences && (
          <div className="bg-zinc-900/80 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">🇨🇳</div>
            <h2 className="text-2xl font-bold mb-4">Chào mừng đến với tiếng Trung!</h2>
            <p className="text-zinc-300 mb-6">Chọn một chức năng để bắt đầu học:</p>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <button onClick={() => setShowVocabulary(true)} className="p-4 bg-amber-500/30 rounded-xl hover:bg-amber-500/50">
                📚 Từ vựng
              </button>
              <button onClick={() => setPracticeMode(true)} className="p-4 bg-cyan-500/30 rounded-xl hover:bg-cyan-500/50">
                🎤 Luyện nói
              </button>
              <button onClick={() => setShowRadicals(true)} className="p-4 bg-green-500/30 rounded-xl hover:bg-green-500/50">
                🔤 Bộ thành
              </button>
              <button onClick={() => setShowSentences(true)} className="p-4 bg-purple-500/30 rounded-xl hover:bg-purple-500/50">
                📝 Câu mẫu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}