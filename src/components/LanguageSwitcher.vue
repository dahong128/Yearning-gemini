<template>
  <Dropdown trigger="click" @on-click="onChange">
    <a href="javascript:void(0)">
      {{ currentLabel }}
      <Icon type="ios-arrow-down"></Icon>
    </a>
    <DropdownMenu slot="list">
      <DropdownItem name="zh">中文</DropdownItem>
      <DropdownItem name="en">English</DropdownItem>
      <DropdownItem name="ja">日本語</DropdownItem>
    </DropdownMenu>
  </Dropdown>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { setLang } from '@/language'

@Component
export default class LanguageSwitcher extends Vue {
  get current(): string {
    return (this.$i18n.locale as string) || 'zh'
  }

  get currentLabel(): string {
    switch (this.current) {
      case 'en':
        return 'English'
      case 'ja':
        return '日本語'
      default:
        return '中文'
    }
  }

  onChange(name: string) {
    setLang(name as any)
    // Let parent know if it wants to react
    this.$emit('changed', name)
  }
}
</script>

<style scoped>
</style>
