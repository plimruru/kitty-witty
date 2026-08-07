import { NotebookChapterView } from '../ui/notebook_UI'

/**
 * Менеджер дневника дедушки.
 * Каждая часть костюма раскрывает страницу дневника с историей дедушки.
 */
class JournalManager {
    private chapters: NotebookChapterView[] = [
        {
            number: 1,
            title: 'Дневник дедушки',
            subtitle: 'Найден в детской комнате',
            objective: 'Найди аквариум-шлем у учителя',
            state: 'current'
        },
        {
            number: 2,
            title: 'Страница о ластах',
            subtitle: 'Дедушка писал о течениях',
            objective: 'Получи ласты и перчатки на пляже',
            state: 'locked'
        },
        {
            number: 3,
            title: 'Страница о баллоне',
            subtitle: 'Дедушка писал о кислороде',
            objective: 'Найди баллон в шкафу',
            state: 'locked'
        },
        {
            number: 4,
            title: 'Страница о костюме',
            subtitle: 'Чертёж полного костюма',
            objective: 'Собери костюм в гараже',
            state: 'locked'
        },
        {
            number: 5,
            title: 'Атлантида',
            subtitle: 'Координаты затонувшего города',
            objective: 'Найди Атлантиду в подводном лабиринте',
            state: 'locked'
        }
    ]

    getChapterView(): NotebookChapterView[] {
        return this.chapters
    }

    /** Отмечает главу как текущую */
    setCurrentChapter(number: number) {
        this.chapters.forEach(ch => {
            ch.state = ch.number === number ? 'current' : ch.state
        })
    }

    /** Отмечает главу как завершённую */
    completeChapter(number: number) {
        const chapter = this.chapters.find(ch => ch.number === number)
        if (chapter) {
            chapter.state = 'completed'
        }
        // Следующая глава становится текущей
        const next = this.chapters.find(ch => ch.number === number + 1)
        if (next) {
            next.state = 'current'
        }
    }

    /** Получает историю дедушки для части костюма */
    getGrandpaStory(partId: string): string {
        const stories: Record<string, string> = {
            'aquarium': 'Дедушка писал: "Шлем — это окно в новый мир. Не бойся смотреть вглубь."',
            'flippers': 'Дедушка писал: "Ласты — это свобода движения. Течения не страшны, если умеешь плыть."',
            'balloon': 'Дедушка писал: "Воздух — это жизнь. Береги его, как самое ценное сокровище."',
            'suit': 'Дедушка писал: "Костюм — это не просто одежда. Это моя мечта, которую я передаю тебе."'
        }
        return stories[partId] ?? ''
    }
}

export const journalManager = new JournalManager()
