output=output
echo=off

# solc = 
ifneq ($(use_solc), true)
	HARDHAT=1
endif

all: main


ifndef HARDHAT
SRCS= $(wildcard ./contracts/*.sol) 
ifneq ($(fs), )
	SRCS = $(fs)
endif

SRCS_OBJS = $(patsubst %.sol, %_output, $(SRCS)) 

main: select clean build 

build: $(SRCS_OBJS)
define show_title
    @echo -n "--------------------------------------------------------"
	@echo -n $(1)
    @echo "--------------------------------------------------------"
endef

$(SRCS_OBJS):%_output : %.sol
	$(call show_title, $<)
	@solc  @openzeppelin=`pwd`/node_modules/@openzeppelin --optimize --overwrite --abi --bin -o $(output)/$@ $<
	@echo "output-->:"
	@ls $(output)/$@ 

select:
    ifneq ($(v), )
		@solc-select use $(v)
    endif

#v=0.8.0
install:
    ifneq ($(v), )
		@solc-select install $(v)
    endif

clean:
	@echo "clean ${output}"
	@rm -v -rf $(output)/*

else
#use npx hardhat

main: clean build 

build:
	npx hardhat compile
clean:
	#npx
	npx hardhat clean

upgrade:
	npx hardhat run ./scripts/violas_proof_deploy_upgrade.js

deploy:
	npx hardhat run ./scripts/violas_proof_deploy_upgrade.js

init:init_main init_datas

init_main:
	npx hardhat run ./scripts/init_main.js

init_datas:
	npx hardhat run ./scripts/init_datas.js

show_contract:
	npx hardhat run ./scripts/show_contract.js
endif


define hardhat_run
	npx hardhat run ./scripts/switchs/$(subst _.,.,$(subst __,_,$(strip $(1))_$(strip $(2))_$(strip $(3)).js))
endef

define show_conf
	npx hardhat run ./scripts/switchs/show_confs.js
endef

open: 
	$(call show_conf)
	$(call hardhat_run , open, $(target), $(index))
	$(call show_conf)

close: 
	$(call show_conf)
	$(call hardhat_run , close, $(target), $(index))
	$(call show_conf)

closed: update_conf show_conf



update_conf: show_conf

show_conf:
	$(call show_conf)


.PHONY: select build clean deploy init init_main init_datas show_conf show_contract open close
