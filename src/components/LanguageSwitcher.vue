<template>
  <Dropdown trigger="click" @on-click="onChange" :class="wrapperClass">
    <a href="javascript:void(0)" class="lang-switcher__btn">
      {{ currentLabel }}
      <Icon type="ios-arrow-down" />
    </a>
    <DropdownMenu slot="list">
      <DropdownItem name="zh">中文</DropdownItem>
      <DropdownItem name="en">English</DropdownItem>
      <DropdownItem name="ja">日本語</DropdownItem>
    </DropdownMenu>
  </Dropdown>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { setLang } from '@/language'

@Component
export default class LanguageSwitcher extends Vue {
  // visual theme: default (for light headers) | ghost (for dark backgrounds)
  @Prop({ default: 'default' }) readonly theme!: 'default' | 'ghost'

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

  get wrapperClass() {
    return {
      'lang-switcher': true,
      'lang-switcher--ghost': this.theme === 'ghost'
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
.lang-switcher__btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  text-decoration: none;
}

/* Ghost theme for dark backgrounds (e.g., login page) */
.lang-switcher--ghost .lang-switcher__btn {
  color: #ffffff;
  padding: 4px 8px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 4px;
  line-height: 1;
}
.lang-switcher--ghost .lang-switcher__btn:hover {
  border-color: #ffffff;
}
.lang-switcher--ghost .lang-switcher__btn .ivu-icon {
  color: inherit;
}
</style>
