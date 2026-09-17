import { useTranslation } from 'react-i18next'
import { ArrowRight, MapPin, Sparkles, Store } from 'lucide-react'
import hotpot from '@/assets/hotpot.jpg'
import { Button } from '@/components/ui/button'
import { products, tableAreas } from '@/data/menu'
import { money } from '@/lib/utils'

interface WelcomeViewProps {
  table: string
  onEnter: () => void
}

export function WelcomeView({ table, onEnter }: WelcomeViewProps) {
  const { t } = useTranslation()
  const areaKey = tableAreas[table]
  const tableLabel = areaKey ? `${table} · ${t(areaKey)}` : table
  const recommended = products.filter((product) => product.badge)

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-rice-100 paper-noise dark:bg-charcoal-900">
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-chili-100 blur-3xl dark:bg-chili-500/20" />
      <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-amber-100 blur-3xl dark:bg-amber-500/15" />

      <div className="relative mx-auto w-full max-w-md px-5 py-10">
        <section className="animate-rise overflow-hidden rounded-3xl border border-white/80 bg-white/90 shadow-float backdrop-blur dark:border-white/10 dark:bg-charcoal-800/90">
          {/* 门店图片 */}
          <div className="relative h-48 overflow-hidden sm:h-56">
            <img src={hotpot} alt={t('welcome.img_alt')} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-charcoal-900/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
              <div className="flex items-center gap-2">
                <Store size={18} className="opacity-80" />
                <div>
                  <p className="text-xs opacity-80">{t('common.simulated_store')}</p>
                  <h2 className="text-lg font-bold">{t('common.store_name')}</h2>
                </div>
              </div>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur">{t('common.open')}</span>
            </div>
          </div>

          {/* 问候语 */}
          <div className="px-6 py-8 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-chili-500/20 bg-chili-50 px-3 py-1.5 text-xs font-bold text-chili-600 dark:border-chili-500/30 dark:bg-chili-500/15 dark:text-chili-100">
              <Sparkles size={13} /> {t('welcome.badge')}
            </div>
            <h1 className="text-3xl font-extrabold leading-tight text-charcoal-900 sm:text-4xl dark:text-rice-50">
              {t('welcome.title')}
            </h1>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-base font-semibold text-charcoal-500 dark:text-rice-200">
              <MapPin size={16} className="text-chili-500" />
              {t('welcome.you_at')} {tableLabel}
            </p>
          </div>

          {/* 推荐菜品 */}
          {recommended.length > 0 && (
            <div className="px-6 pb-2">
              <h3 className="mb-3 text-sm font-bold text-charcoal-900 dark:text-rice-50">{t('welcome.recommend_title')}</h3>
              <div className="scrollbar-none -mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
                {recommended.map((product) => (
                  <article key={product.id} className="w-40 shrink-0 overflow-hidden rounded-2xl border border-charcoal-900/5 bg-rice-50 shadow-sm dark:border-white/5 dark:bg-charcoal-700/60">
                    <div className="relative h-24 overflow-hidden">
                      <img src={product.image} alt={t(product.name)} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/40 to-transparent" />
                      {product.badge && (
                        <span className="absolute left-2 top-2 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-extrabold text-charcoal-900">
                          {t(product.badge)}
                        </span>
                      )}
                    </div>
                    <div className="p-2.5">
                      <h4 className="line-clamp-1 text-xs font-bold text-charcoal-900 dark:text-rice-50">{t(product.name)}</h4>
                      <p className="mt-1 text-sm font-extrabold text-chili-500">{money(product.price)}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* 进入点餐按钮 */}
          <div className="px-6 pb-7 pt-4">
            <Button onClick={onEnter} className="w-full">
              {t('welcome.enter')}
              <ArrowRight size={17} />
            </Button>
          </div>
        </section>
      </div>
    </main>
  )
}
