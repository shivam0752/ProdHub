import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

export default function LiveCount() {
  const [count, setCount] = useState<number>(0)
  const [live, setLive] = useState(false)

  useEffect(() => {
    async function fetchStats() {
      try {
        if (isSupabaseConfigured) {
          const { data, error } = await supabase
            .from('site_stats')
            .select('total_users')
            .eq('id', 1)
            .single()

          if (error) throw error
          if (data) {
            setCount(data.total_users)
            setLive(true)
          }
        } else {
          // Local fallback mock
          setCount(142)
          setLive(false)
        }
      } catch (err) {
        console.error('Error fetching site stats:', err)
        // Static fallback count
        setCount(142)
        setLive(false)
      }
    }

    fetchStats()

    if (isSupabaseConfigured) {
      // Subscribe to real-time updates on site_stats
      const channel = supabase
        .channel('realtime-site-stats')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'site_stats',
            filter: 'id=eq.1'
          },
          (payload: { new: { total_users: number } }) => {
            console.log('Realtime site stats updated:', payload)
            if (payload.new && typeof payload.new.total_users === 'number') {
              setCount(payload.new.total_users)
              setLive(true)
            }
          }
        )
        .subscribe((status: string) => {
          if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
            setLive(false)
          }
        })

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [])

  return (
    <div className="bg-brand-navy p-5 flex flex-col justify-between rounded-card space-y-2 border-none">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-widest text-white/35 font-medium">
          Active Fellows
        </span>
        <div className="flex items-center gap-1.5">
          <span
            className={`w-[5px] h-[5px] rounded-full ${live ? 'bg-brand-positive animate-pulse-dot' : 'bg-white/35'
              }`}
            title={live ? 'Live connection active' : 'Offline fallback mode'}
          />
          <span className="text-[10px] font-mono text-brand-positive uppercase tracking-widest font-medium">
            {live ? 'Live' : 'Static'}
          </span>
        </div>
      </div>
      <div>
        <div className="text-[36px] font-mono font-medium text-white leading-none">
          {count}
        </div>
        <p className="text-[11px] text-white/40 font-display mt-1">
          Total Active Users
        </p>
      </div>
    </div>
  )
}
